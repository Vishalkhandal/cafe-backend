const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

router.get('/', authMiddleware, userController.getUser);
router.get('/users', userController.getUsers);
router.get('/protected', authMiddleware, userController.getUser);

module.exports = router;