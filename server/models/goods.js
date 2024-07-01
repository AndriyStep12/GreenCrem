const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    name: String,
    id: String,
    price: Number,
    description: String,
    tags: [String],
    count: Number,
    img: String
});

module.exports = mongoose.model('goods', goodsSchema);
