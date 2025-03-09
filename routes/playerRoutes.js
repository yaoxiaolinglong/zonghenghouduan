/**
 * 玩家系统路由
 * Player System Routes
 * 
 * 定义玩家系统的API端点
 * Defines API endpoints for the player system
 */

const express = require('express');
const router = express.Router();
const playerController = require('../controllers/playerController');
const { authenticateToken } = require('../middleware/auth');

// 测试路由
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: '玩家系统路由测试成功'
  });
});

// 创建玩家
router.post('/create', authenticateToken, playerController.createPlayer);

// 获取玩家信息
router.get('/me', authenticateToken, playerController.getPlayer);

// 更新玩家信息
router.put('/update', authenticateToken, playerController.updatePlayer);

// 获取玩家背包
router.get('/inventory', authenticateToken, playerController.getPlayerInventory);

// 添加物品到背包
router.post('/inventory/add', authenticateToken, playerController.addItemToInventory);

// 从背包移除物品
router.post('/inventory/remove', authenticateToken, playerController.removeItemFromInventory);

module.exports = router; 