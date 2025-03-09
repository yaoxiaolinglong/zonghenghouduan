/**
 * 灵兽装备系统路由
 * Beast Equipment System Routes
 * 
 * 定义灵兽装备系统的API端点
 * Defines API endpoints for the beast equipment system
 */

const express = require('express');
const router = express.Router();
const beastEquipmentController = require('../controllers/beastEquipmentController');
const { authenticateToken } = require('../middleware/auth');

// 公共路由 - 获取装备信息（不需要认证）
router.get('/equipment', beastEquipmentController.getAllEquipment);
router.get('/equipment/:equipmentId', beastEquipmentController.getEquipmentById);

// 测试路由
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: '灵兽装备系统路由测试成功'
  });
});

// 需要认证的路由
router.post('/create', authenticateToken, beastEquipmentController.createEquipmentForPlayer);
router.post('/equip', authenticateToken, beastEquipmentController.equipGear);
router.post('/unequip', authenticateToken, beastEquipmentController.unequipGear);
router.post('/enhance', authenticateToken, beastEquipmentController.enhanceEquipment);
router.post('/repair', authenticateToken, beastEquipmentController.repairEquipment);

module.exports = router; 