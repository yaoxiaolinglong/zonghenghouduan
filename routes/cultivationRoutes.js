/**
 * 修炼系统路由
 * Cultivation System Routes
 * 
 * 这个文件定义了与修炼系统相关的路由
 * This file defines routes related to the cultivation system
 */

const express = require('express');
const router = express.Router();
const CultivationController = require('../controllers/cultivationController');
const { authenticateToken } = require('../middleware/auth');

// 开始修炼
router.post('/start', authenticateToken, CultivationController.startCultivation);

// 结束修炼
router.post('/end', authenticateToken, CultivationController.endCultivation);

// 获取修炼状态
router.get('/status/:userId', authenticateToken, CultivationController.getCultivationStatus);

// 尝试突破
router.post('/breakthrough/attempt', authenticateToken, CultivationController.attemptBreakthrough);

// 完成突破
router.post('/breakthrough/complete', authenticateToken, CultivationController.completeBreakthrough);

module.exports = router; 