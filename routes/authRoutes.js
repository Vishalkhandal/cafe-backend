const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {authMiddleware} = require('../middleware/authMiddleware')

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/logout', authController.logoutUser);

// 👇 Example protected route
router.get('/me', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'You are authorized', user: req.user });
});

module.exports = router;