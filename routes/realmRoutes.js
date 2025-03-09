/**
 * 境界系统路由
 * Realm System Routes
 * 
 * 定义境界系统的API端点
 * Defines API endpoints for the realm system
 */

const express = require('express');
const router = express.Router();
const realmController = require('../controllers/realmController');
const { authenticateToken } = require('../middleware/auth');

// 获取所有境界
router.get('/', realmController.getAllRealms);

// 获取角色当前境界
router.get('/:userId', authenticateToken, realmController.getCharacterRealm);

// 尝试境界突破
router.post('/breakthrough/attempt', authenticateToken, realmController.attemptBreakthrough);

// 完成境界突破
router.post('/breakthrough/complete', authenticateToken, realmController.completeBreakthrough);

module.exports = router; 