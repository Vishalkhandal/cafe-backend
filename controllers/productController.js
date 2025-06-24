const Product = require('../models/Product');

// Create Product
const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Single Product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.user.id);
        if (!product) return res.status(404).json({ msg: "Product not found." });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.user.id,
            req.body,
            { new: true }
        );
        if (!product) return res.status(404).json({ msg: "Product not found." });
        res.json({ product, msg: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.user.id);
        if (!product) return res.status(404).json({ msg: "Product not found." });
        res.json({ msg: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { createProduct, getProduct, getProducts, updateProduct, deleteProduct };
