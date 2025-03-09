/**
 * 灵兽秘境系统路由
 * Beast Secret Realm System Routes
 * 
 * 定义灵兽秘境系统的API端点
 * Defines API endpoints for the beast secret realm system
 */

const express = require('express');
const router = express.Router();
const secretRealmController = require('../controllers/secretRealmController');
const { authenticateToken } = require('../middleware/auth');

// 公共路由 - 获取秘境信息（不需要认证）
router.get('/realms', secretRealmController.getAllRealms);
router.get('/realms/:realmId', secretRealmController.getRealmById);

// 测试路由
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: '灵兽秘境系统路由测试成功'
  });
});

// 需要认证的路由
router.get('/progress', authenticateToken, secretRealmController.getPlayerProgress);
router.post('/enter', authenticateToken, secretRealmController.enterRealm);
router.post('/challenge', authenticateToken, secretRealmController.challengeLevel);
router.post('/claim-rewards', authenticateToken, secretRealmController.claimRealmRewards);

module.exports = router; 