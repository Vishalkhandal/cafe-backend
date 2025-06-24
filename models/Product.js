const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: { 
        type : String,
        required: true
    },
    category: { 
        type: String,
        required: true,
        enum: [
            'Beverage',
            'Snack',
            'Dessert',
            'Main Course',
            'Other'
        ]
    },
    price: {
        type: Number,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
}, {timestamps: true})

const Product = mongoose.model("Product", productSchema);
module.exports = Product;