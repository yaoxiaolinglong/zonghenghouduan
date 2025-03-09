/**
 * 灵兽系统路由
 * Beast System Routes
 * 
 * 定义灵兽系统的API端点
 * Defines API endpoints for the beast system
 */

const express = require('express');
const router = express.Router();
const beastController = require('../controllers/beastController_fixed');
const { authenticateToken } = require('../middleware/auth');

// 公共路由 - 灵兽图鉴信息（不需要认证）
router.get('/beasts', beastController.getAllBeasts);
router.get('/beasts/:beastId', beastController.getBeastById);

// 测试路由
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: '灵兽系统路由测试成功'
  });
});

// 玩家灵兽管理 - 需要认证的路由
router.get('/mybeasts', authenticateToken, beastController.getPlayerBeasts);
router.get('/mybeasts/:playerBeastId', authenticateToken, beastController.getPlayerBeastById);
router.post('/capture', authenticateToken, beastController.captureBeast);
router.post('/train', authenticateToken, beastController.trainBeast);
router.post('/feed', authenticateToken, beastController.feedBeast);
router.post('/evolve', authenticateToken, beastController.evolveBeast);
router.post('/rename', authenticateToken, beastController.renameBeast);
router.delete('/release/:playerBeastId', authenticateToken, beastController.releaseBeast);

// 灵兽部署管理
router.post('/deploy', authenticateToken, beastController.deployBeast);
router.delete('/undeploy/:playerBeastId', authenticateToken, beastController.undeployBeast);
router.get('/deployed', authenticateToken, beastController.getDeployedBeasts);

// 新增灵兽功能
// 获取推荐灵兽
router.get('/recommended', authenticateToken, beastController.getRecommendedBeasts);

// 灵兽配对
router.post('/pair', authenticateToken, beastController.pairBeasts);

// 灵兽探险
router.post('/expedition', authenticateToken, beastController.sendBeastOnExpedition);
router.post('/expedition/complete/:playerBeastId', authenticateToken, beastController.completeExpedition);

module.exports = router; 