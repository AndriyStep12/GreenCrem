const mongoose = require('mongoose');

const ordersSchema = new mongoose.Schema({
    pass: String,
    client: String,
    phone: String,
    email: String,
    status: {
        type: String,
        default: 'Pending'
    },
    goods: [{
        name: String,
        id: String,
        price: Number,
        description: String,
        tags: [String],
        count: Number,
        totalPrice: Number
    }],
    totalPrice: Number
});

module.exports = mongoose.model('orders', ordersSchema);