const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

// 获取所有任务
router.get('/', TaskController.getAllTasks);

// 完成任务
router.post('/complete', TaskController.completeTask);

// 创建测试任务（仅用于测试）
router.post('/create-test', TaskController.createTestTask);

module.exports = router; 