const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// 注册新用户
router.post('/register', UserController.register);

// 用户登录
router.post('/login', UserController.login);

module.exports = router; 