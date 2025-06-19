const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/profile', authMiddleware, userController.getUser);
router.get('/dashboard', authMiddleware, userController.getUser);
router.get('/users', userController.getUsers);

module.exports = router;