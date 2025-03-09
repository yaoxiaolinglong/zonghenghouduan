/**
 * 法宝系统路由
 * Artifact System Routes
 * 
 * 定义法宝系统的API端点
 * Defines API endpoints for the artifact system
 */

const express = require('express');
const router = express.Router();
const artifactController = require('../controllers/artifactController');
const { authenticateToken } = require('../middleware/auth');

// 获取所有法宝
router.get('/', artifactController.getAllArtifacts);

// 获取法宝详情
router.get('/:artifactId', artifactController.getArtifactDetails);

// 获取玩家拥有的法宝
router.get('/player/:userId', authenticateToken, artifactController.getPlayerArtifacts);

// 装备法宝
router.post('/equip', authenticateToken, artifactController.equipArtifact);

// 卸下法宝
router.post('/unequip', authenticateToken, artifactController.unequipArtifact);

// 升级法宝
router.post('/upgrade', authenticateToken, artifactController.upgradeArtifact);

// 获取法宝
router.post('/acquire', authenticateToken, artifactController.acquireArtifact);

module.exports = router; 