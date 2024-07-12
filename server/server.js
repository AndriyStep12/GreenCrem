const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');
const { ObjectId } = require('mongodb');
const multer = require("multer");
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 11000;

// --------------------------------------------------------- Importing models
const Goods = require('./models/goods')

// --------------------------------------------------------- MongoDB Atlas connection URI
const uri = "mongodb+srv://greencrem-admin:crem_is_green100percent@cluster0.ajgpp9n.mongodb.net/database?retryWrites=true&w=majority";

// --------------------------------------------------------- Middleware
app.use(express.json());
app.use(bodyParser.json());

// CORS settings
const corsOptions = {
    origin: 'https://green-crem.vercel.app',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// --------------------------------------------------------- Database connection
async function connect() {
    try {  
        await mongoose.connect(uri);
        console.log(`Connected to MongoDB Atlas`);
    } catch (error) {
        console.error(`Connection error: ${error}`);
    }
}

connect();

// --------------------------------------------------------- Routes
app.get('/api/goods', async(req, res) => {
    try {
        const goods = await Goods.find();
        res.status(200).json(goods);
    } catch(error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/send-order', async (req, res) => {
    const { cartItems, formData } = req.body;
    console.log('Received cart items:', cartItems);
    console.log('Received form data:', formData);

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: 'tuningpass@gmail.com',
            pass: 'zxyc ummd eonm slvw'
        }
    });

    try {
        await transporter.sendMail({
            from: 'tuningpass@gmail.com',
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

// --------------------------------------------------------- Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, "../public/uploads/");
        
        // Створюємо директорію, якщо вона не існує
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), async (req, res) => {
    const { name, description, price, count, tags } = req.body;
    const imageName = req.file.filename;
    const id = Date.now();

    try {
        console.log('Received image:', imageName);
        console.log('Received form data:', { name, description, price, count, tags });

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
        console.error('Error creating goods:', error);
        res.status(500).json({ status: "error", message: error.message });
    }
});

// --------------------------------------------------------- Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});


// --------------------------------------------------------- Alarm
setInterval(() => {
    console.log(`I'm awake, awake`)
}, 60000*10);