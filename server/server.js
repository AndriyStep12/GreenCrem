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
        await mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });
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
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

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

app.post('/send-order', async (req, res) => {
    const { cartItems, formData } = req.body;
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

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'andystep2008@gmail.com',
            subject: 'New Order',
            html: `
                <h3>Customer Information</h3>
                <p>Name: ${formData.name}</p>
                <p>Phone: ${formData.phone}</p>
                <p>Email: ${formData.email}</p>
                <h3>Order Details</h3>
                <ul>
                    ${cartItems.map(item => `<li>ID: ${item.id}, Quantity: ${item.count}</li>`).join('')}
                </ul>
            `
        });

        console.log('Email sent successfully');
        res.status(200).send('Order received and email sent.');
    } catch (error) {
        console.error('Failed to send email:', error);
        res.status(500).send('Failed to send email.');
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

// --------------------------------------------------------- Alarm
setInterval(() => {
    console.log(`I'm awake, awake`)
}, 60000);
