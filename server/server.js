const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const TelegramBot = require('node-telegram-bot-api');
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
}

connect();

// --------------------------------------------------------- Ensure upload directory exists
const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --------------------------------------------------------- Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

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

// --------------------------------------------------------- Order sending function
const sendOrderEmail = async (transporter, orderDetails) => {
    const { formData, cartItems, orderCode, totalPrice } = orderDetails;

    // Admin email
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

    // Client email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: formData.email,
        subject: 'Підтвердіть ваше замовлення',
        html: `
            <div>
                <h3>Доброго дня</h3>
                <p>Цей спосіб оплати передбачає часткову передплату на карту - у сумі 500 грн</p>
                <p>Реквізити для оплати: UA403052990000026004011032613</p>
                <p>Призначення платежу: Оплата за товар ( № ${orderCode} )</p>
                <p>Отримувач - ФОП АБДІЄВА ЛІЛІЯ-АННА АНДРіїЇВНА</p>
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
};

// --------------------------------------------------------- Send Order Route
app.post('/send-order', async (req, res) => {
    const { cartItems, formData, orderCode } = req.body;
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.count, 0);

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
        // Send order email
        await sendOrderEmail(transporter, { cartItems, formData, orderCode, totalPrice });

        // Save the order in the database
        const newOrder = new Orders({
            pass: orderCode,
            client,
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
        await newOrder.save();

        res.status(200).json({
            message: 'Order placed successfully and emails sent'
        });
    } catch (error) {
        console.error('Error sending order:', error);
        res.status(500).send('Internal Server Error');
    }
});

// --------------------------------------------------------- Telegram Bot
const token = process.env.BOT_API;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/myID/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `Your chat id - ${chatId}`);
});

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
                    const totalPrice = order.goods.reduce((sum, item) => sum + (item.price || 0) * item.count, 0);

                    const messageForTelegram = `
🛒 *Знайдене замовлення*
*Інформація про покупця:*
Ім'я: ${order.client}
Номер телефону: ${order.phone}
Емейл: ${order.email}

*Інформація про замовлення:*
Код замовлення: ${order.pass}
Загальна вартість замовлення: ${totalPrice}$
Товари:
${order.goods.map(item => `
Назва товару: ${item.name}
ID: ${item.id}
Кількість: ${item.count}
Ціна за одиницю: ${item.price}
Загальна ціна: ${item.price * item.count}
`).join('')}
`;

                    bot.sendMessage(chatId, `Знайдене замовлення:\n${messageForTelegram}`);
                } else {
                    bot.sendMessage(chatId, 'Замовлення не знайдено');
                }
            } catch (error) {
                console.error('Error finding order:', error);
                bot.sendMessage(chatId, 'Виникла помилка при пошуку замовлення');
            }
        } else {
            bot.sendMessage(chatId, 'Введіть код замовлення.');
        }
    }
});

// --------------------------------------------------------- Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
