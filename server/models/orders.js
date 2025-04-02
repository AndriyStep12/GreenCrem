const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    pass: {
        type: String,
        required: true
    },
    client: String,
    phone: String,
    email: String,
    goods: [{
        name: String,
        id: String,
        price: Number,
        description: String,
        tags: [String],
        count: Number,
        img: String,
        totalPrice: Number
    }],
    status: {
        type: String,
        default: 'Pending'
    }
});

module.exports = mongoose.model('orders', ordersSchema);