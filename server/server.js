const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const multer = require("multer");
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT;

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

app.post('/send-order', async (req, res) => {
    try {
        const { cartItems, formData, orderCode } = req.body;
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.count, 0);
        console.log('Received cart items:', cartItems);
        console.log('Received form data:', formData);

        const client = `${formData.name} ${formData.sename}`;

        // Function to escape special characters in Markdown
        const escapeMarkdown = (text) => {
            return text.replace(/_/g, '\_')
                       .replace(/\*/g, '\\*')
                       .replace(/\[/g, '\\[')
                       .replace(/`/g, '\\`')
                       .replace(/>/g, '\\>')
                       .replace(/-/g, '\\-');
        };

        const messageForTelegram = `
            🛒 *Нове замовлення*
            *Інформація про покупця:*
            Ім'я: ${escapeMarkdown(formData.name)}
            Прізвище: ${escapeMarkdown(formData.sename)}
            Номер телефону: ${escapeMarkdown(formData.phone)}
            Емейл: ${escapeMarkdown(formData.email)}

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
            `).join('')}`;

        // Send message to Telegram
        await bot.sendMessage(1015683844, messageForTelegram, { parse_mode: 'Markdown' });
        await bot.sendMessage(5593526966, messageForTelegram, { parse_mode: 'Markdown' });

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send order confirmation email to admin
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'andystep2008@gmail.com',
            subject: 'Нове замовлення',
            html: `
                <div>
                    <h3>Інформація про покупця</h3>
                    <p>Ім'я: ${formData.name}</p>
                    <p>Прізвище: ${formData.sename}</p>
                    <p>Номер телефону: ${formData.phone}</p>
                    <p>Емейл: ${formData.email}</p>
                    <h3>Інформація про замовлення</h3>
                    <p>Код замовлення: ${orderCode}</p>
                    <ul>
                        ${cartItems.map(item => `
                            <li>
                                <p>Назва товару: ${item.name}</p>
                                <p>ID: ${item.id}</p>
                                <p>Кількість: ${item.count}</p>
                                <p>Ціна за одиницю: ${item.price}</p>
                                <p>Загальна ціна: ${item.price * item.count}</p>
                                <a href="https://green-crem.vercel.app/products/${item.id}">Сторінка продукту</a>
                            </li>
                        `).join('')}
                    </ul>
                    <p>Загальна вартість замовлення: ${totalPrice}$</p>
                </div>
            `
        });

        // Send order confirmation email to client
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: formData.email,
            subject: 'Підтвердіть ваше замовлення',
            html: `
                <div>
                    <h3>Доброго дня</h3>
                    <p>Цей спосіб оплати передбачає часткову передплату на карту - у сумі 500 грн
                    <br>
                    Реквізити для оплати:
                    <br>
                    UA403052990000026004011032613
                    РНОКПП/ЄДРПОУ 
                    3648604682  
                    Призначення платежу: Оплата за товар ( № ${orderCode} )
                    Отримувач - ФОП АБДІЄВА ЛІЛІЯ-АННА АНДРіїЇВНА
                    <br>
                    Для підтвердження замовлення та оплати, будь ласка, відправте НОМЕР ЗАМОВЛЕННЯ та скрін/чек оплати нам у мессенджери нижче, або в директ інстаграм:
                    <br>
                    Або повідомте по телефону 380 (68) 419 37 08
                    <br>
                    Дякуємо за замовлення!</p>
                    <h3>Інформація про ваше замовлення</h3>
                    <p>Код замовлення: ${orderCode}</p>
                    <ul>
                        ${cartItems.map(item => `
                            <li>
                                <p>Назва товару: ${item.name}</p>
                                <p>ID: ${item.id}</p>
                                <p>Кількість: ${item.count}</p>
                                <p>Ціна за одиницю: ${item.price}</p>
                                <p>Загальна ціна: ${item.price * item.count}</p>
                                <a href="https://green-crem.vercel.app/products/${item.id}">Сторінка продукту</a>
                            </li>
                        `).join('')}
                    </ul>
                    <p>Загальна вартість замовлення: ${totalPrice}$</p>
                </div>
            `
        });

        // Save the order in the database
        console.log('Attempting to save order to database...');
        const newOrder = new Orders({
            pass: orderCode,
            client: client,
            phone: formData.phone,
            email: formData.email,
            goods: cartItems.map(item => ({
                name: item.name,
                id: item.id,
                price: item.price,
                count: item.count,
                totalPrice: item.price * item.count
            })),
            status: 'Pending',
        });
        try {
            const savedOrder = await newOrder.save();
            console.log('Order saved successfully:', savedOrder);
        } catch (dbError) {
            console.error('Failed to save order to database:', dbError);
            throw new Error('Failed to save order to database');
        }

        res.status(200).json({
            message: 'Order placed successfully and emails sent'
        });
    } catch (error) {
        console.error('Error sending order:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// --------------------------------------------------------- Telegram Bot
// --------------------------------------------------------- Telegram Bot
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_API;
const bot = new TelegramBot(token, { polling: true });

// Екранірування символів для MarkdownV2
const escapeMarkdown = (text) => {
    return text
        .replace(/_/g, '\\_')
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
