const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require("multer");
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

// --------------------------------------------------------- Telegram Bot Initialization
const token = process.env.BOT_API;
let bot = null;

if (token) {
    bot = new TelegramBot(token, { polling: true });
    console.log('Telegram bot initialized successfully');
} else {
    console.warn('Telegram bot token not found in environment variables');
}

// --------------------------------------------------------- Importing models
const Goods = require('./models/goods');
const Orders = require('./models/orders');

// --------------------------------------------------------- Middleware
app.use(express.json());
app.use(bodyParser.json());

// --------------------------------------------------------- CORS settings
const corsOptions = {
    origin: process.env.CORS_ORIGIN.split(','),
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --------------------------------------------------------- Database connection
async function connect() {
    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(`Connected to MongoDB Atlas`);
    } catch (error) {
        console.error(`Connection error: ${error}`);
    }
};

connect();

// --------------------------------------------------------- Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
};

// --------------------------------------------------------- Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage
});

// --------------------------------------------------------- Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --------------------------------------------------------- Helper functions
// Генерація унікального ID для замовлення
const generateOrderId = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Екранірування символів для MarkdownV2
const escapeMarkdown = (text) => {
    return text
        .replace(/_/g, '\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/~/g, '\\~')
        .replace(/`/g, '\\`')
        .replace(/>/g, '\\>')
        .replace(/#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/-/g, '\\-')
        .replace(/=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/{/g, '\\{')
        .replace(/}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/!/g, '\\!');
};

// --------------------------------------------------------- Routes
app.get('/api/goods', async (req, res) => {
    try {
        const goods = await Goods.find();
        res.status(200).json(goods);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/orders', async (req, res) => {
    try {
        const orders = await Orders.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Маршрут для обробки нових замовлень
app.post('/send-order', async (req, res) => {
    try {
        const { cartItems, formData, orderCode } = req.body;

        // Валідація вхідних даних
        if (!cartItems || !formData || !orderCode) {
            return res.status(400).json({ success: false, message: 'Неповні дані замовлення' });
        }

        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.count, 0);
        const client = `${formData.name} ${formData.sename}`;
        const phone = formData.phone;
        const email = formData.email;

        const newOrder = new Orders({
            pass: orderCode,
            client,
            phone,
            email,
            goods: cartItems,
            totalPrice
        });

        await newOrder.save();

        const messageForTelegram = `
🛒 *Нове замовлення*
*Інформація про покупця:*
Ім'я: ${escapeMarkdown(client)}
Номер телефону: ${escapeMarkdown(phone)}
Емейл: ${escapeMarkdown(email)}

*Інформація про замовлення:*
Код замовлення: ${escapeMarkdown(orderCode)}
Загальна вартість замовлення: ${totalPrice}$
Товари:
${cartItems.map(item => `
Назва товару: ${escapeMarkdown(item.name)}
ID: ${escapeMarkdown(item.id)}
Кількість: ${item.count}
Ціна за одиницю: ${item.price}
Загальна ціна: ${item.price * item.count}
`).join('')}
        `;

        // Надсилання повідомлення через Telegram бот
        if (bot) {
            const telegramUserIds = ['1015683844', '5593526966'];
            for (const userId of telegramUserIds) {
                try {
                    // Розбивка повідомлення на частини, якщо воно перевищує 4096 символів
                    if (messageForTelegram.length > 4096) {
                        const parts = messageForTelegram.match(/[\s\S]{1,4096}/g);
                        for (const part of parts) {
                            await bot.sendMessage(userId, part, { parse_mode: 'MarkdownV2' });
                        }
                    } else {
                        await bot.sendMessage(userId, messageForTelegram, { parse_mode: 'MarkdownV2' });
                    }
                } catch (error) {
                    console.error(`Помилка при надсиланні повідомлення користувачу ${userId}:`, error);
                }
            }
        } else {
            console.warn('Telegram bot is not initialized, skipping message sending');
        }

        // Формування HTML для електронного листа
        const emailHtml = `
        <h2>Дякуємо за ваше замовлення!</h2>
        <p><strong>Код замовлення:</strong> ${orderCode}</p>
        <p><strong>Ім'я:</strong> ${client}</p>
        <p><strong>Телефон:</strong> ${phone}</p>
        <p><strong>Email:</strong> ${email}</p>
        <h3>Деталі замовлення:</h3>
        <table border="1" cellpadding="5" style="border-collapse: collapse;">
            <tr>
                <th>Назва товару</th>
                <th>Кількість</th>
                <th>Ціна за одиницю</th>
                <th>Загальна ціна</th>
            </tr>
            ${cartItems.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.count}</td>
                <td>${item.price}$</td>
                <td>${item.price * item.count}$</td>
            </tr>
            `).join('')}
            <tr>
                <td colspan="3"><strong>Загальна вартість:</strong></td>
                <td><strong>${totalPrice}$</strong></td>
            </tr>
        </table>
        <p>Дякуємо за ваше замовлення! Ми зв'яжемося з вами найближчим часом для підтвердження.</p>
        <p>З повагою, команда GreenCrem</p>
        `;

        // Налаштування електронного листа
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `Підтвердження замовлення ${orderCode} - GreenCrem`,
            html: emailHtml
        };

        // Надсилання електронного листа
        await transporter.sendMail(mailOptions);

        // Відповідь клієнту
        res.status(200).json({
            success: true,
            message: 'Замовлення успішно створено',
            orderCode
        });

    } catch (error) {
        console.error('Помилка при обробці замовлення:', error);
        res.status(500).json({
            success: false,
            message: 'Помилка сервера при обробці замовлення'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// --------------------------------------------------------- Telegram Bot Handlers
if (bot) {
    // Обробник команди /find
    bot.onText(/\/find (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const orderCode = match[1].trim();

        if (!orderCode) {
            bot.sendMessage(chatId, 'Будь ласка, введіть код замовлення після команди /find.');
            return;
        }

        try {
            const order = await Orders.findOne({ pass: orderCode });

            if (order) {
                const totalPrice = order.goods.reduce((sum, item) => sum + (item.price || 0) * item.count, 0);

                // Формування повідомлення з екраніруванням символів
                const messageForTelegram = `
🛒 *Знайдене замовлення*
*Інформація про покупця:*
Ім'я: ${escapeMarkdown(order.client)}
Номер телефону: ${escapeMarkdown(order.phone)}
Емейл: ${escapeMarkdown(order.email)}

*Інформація про замовлення:*
Код замовлення: ${escapeMarkdown(order.pass)}
Загальна вартість замовлення: ${totalPrice}$
Товари:
${order.goods.map(item => `
Назва товару: ${escapeMarkdown(item.name)}
ID: ${escapeMarkdown(item.id)}
Кількість: ${item.count}
Ціна за одиницю: ${item.price}
Загальна ціна: ${item.price * item.count}
`).join('')}
                `;

                // Розбивка повідомлення на частини, якщо воно перевищує 4096 символів
                if (messageForTelegram.length > 4096) {
                    const parts = messageForTelegram.match(/[\s\S]{1,4096}/g);
                    for (const part of parts) {
                        await bot.sendMessage(chatId, part, { parse_mode: 'MarkdownV2' });
                    }
                } else {
                    bot.sendMessage(chatId, messageForTelegram, { parse_mode: 'MarkdownV2' });
                }
            } else {
                bot.sendMessage(chatId, 'Замовлення з таким кодом не знайдено.');
            }
        } catch (error) {
            console.error('Failed to find order:', error);
            bot.sendMessage(chatId, 'Виникла помилка при пошуку замовлення.');
        }
    });
}
