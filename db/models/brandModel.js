const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products' // Corrected to match the products model name
    }],
    image: {
        type: String
    },
}, { timestamps: true });

module.exports = mongoose.model('brand', brandSchema);