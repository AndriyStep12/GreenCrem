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
    const { cartItems, formData, orderCode } = req.body;
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.count, 0);
    console.log('Received cart items:', cartItems);
    console.log('Received form data:', formData);

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const client = `${formData.name} ${formData.sename}`;

    const messageForTelegram = `
🛒 *Нове замовлення*
*Інформація про покупця:*
Ім'я: ${formData.name}
Прізвище: ${formData.sename}
Номер телефону: ${formData.phone}
Емейл: ${formData.email}

*Інформація про замовлення:*
Код замовлення: ${orderCode}
Загальна вартість замовлення: ${totalPrice}$
Товари:
${cartItems.map(item => `
Назва товару: ${item.name}
ID: ${item.id}
Кількість: ${item.count}
Ціна за одиницю: ${item.price}
Загальна ціна: ${item.price * item.count}
`).join('')}
`;

    try {
        await bot.sendMessage(1015683844, messageForTelegram, { parse_mode: 'Markdown' });

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
                    Отримувач - ФОП АБДІЄВА ЛІЛІЯ-АННА АНДРІЇВНА
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

        const newOrder = new Orders({
            pass: orderCode,
            client: client,
            phone: formData.phone,
            email: formData.email,
            goods: cartItems.map(item => ({
                name: item.name,
                id: item.id,
                price: item.price,
                description: item.description || '',
                tags: item.tags || [],
                count: item.count,
                img: item.img
            }))
        });

        await newOrder.save();

        res.json({ status: "ok" });
        console.log('Order received and emails sent successfully');
    } catch (error) {
        console.error('Failed to send email or save order:', error);
        res.status(500).send('Failed to send email or save order.');
    }
});

app.post("/upload-image", upload.single("image"), async (req, res) => {
    const { name, description, price, count, tags } = req.body;
    const imageName = req.file.filename;
    const id = Date.now();

    try {
        await Goods.create({
            name,
            id: 'good' + id,
            description,
            price,
            count,
            tags: Array.isArray(tags) ? tags : [tags],
            img: imageName
        });
        res.json({ status: "ok" });
    } catch (error) {
        console.error('Failed to upload image:', error);
        res.status(500).json({ status: 'Failed to upload image' });
    }
});

// --------------------------------------------------------- Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

// --------------------------------------------------------- Telegram Bot
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.BOT_API;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === '/myID') {
        bot.sendMessage(chatId, `Your chat id - ${chatId}`);
    } else if (msg.text.startsWith('/find')) {
        const orderCode = msg.text.split(' ')[1];
        if (orderCode) {
            try {
                const order = await Orders.findOne({ pass: orderCode });
                if (order) {
                    bot.sendMessage(chatId, `Order found: ${JSON.stringify(order, null, 2)}`);
                } else {
                    bot.sendMessage(chatId, 'Order not found');
                }
            } catch (error) {
                console.error('Failed to find order:', error);
                bot.sendMessage(chatId, 'Internal Server Error');
            }
        } else {
            bot.sendMessage(chatId, 'Please provide an order code after /find command');
        }
    }
});
