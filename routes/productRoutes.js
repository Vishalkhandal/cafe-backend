const express = require('express');
const { createProduct, getProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Secure create, update, delete routes
router.post('/createProduct', authMiddleware, createProduct);
router.get('/getProduct', getProduct); // Use URL param for product id
router.get('/allProduct', getProducts);
router.put('/updateProduct', authMiddleware, updateProduct); // Use PUT and URL param
router.delete('/deleteProduct', authMiddleware, deleteProduct); // Use DELETE and URL param

module.exports = router;