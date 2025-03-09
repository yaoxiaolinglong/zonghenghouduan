/**
 * 丹药系统路由
 * Pill System Routes
 * 
 * 定义丹药系统的API端点
 * Defines API endpoints for the pill system
 */

const express = require('express');
const router = express.Router();
const pillController = require('../controllers/pillController');
const { authenticateToken } = require('../middleware/auth');

// 获取所有丹药
router.get('/', pillController.getAllPills);

// 获取特定丹药详情
router.get('/:pillId', pillController.getPillDetails);

// 获取玩家拥有的丹药
router.get('/player/:userId', authenticateToken, pillController.getPlayerPills);

// 获取当前生效的丹药效果
router.get('/effects/:userId', authenticateToken, pillController.getActiveEffects);

// 获取丹药
router.post('/acquire', authenticateToken, pillController.acquirePill);

// 使用丹药
router.post('/use', authenticateToken, pillController.usePill);

module.exports = router; 