/**
 * 灵兽技能系统路由
 * Beast Skill System Routes
 * 
 * 定义灵兽技能系统的API端点
 * Defines API endpoints for the beast skill system
 */

const express = require('express');
const router = express.Router();
const beastSkillController = require('../controllers/beastSkillController');
const { authenticateToken } = require('../middleware/auth');

// 公共路由 - 获取技能信息（不需要认证）
router.get('/skills', beastSkillController.getAllSkills);
router.get('/skills/:skillId', beastSkillController.getSkillById);

// 测试路由
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: '灵兽技能系统路由测试成功'
  });
});

// 需要认证的路由
router.post('/learn', authenticateToken, beastSkillController.learnSkill);
router.post('/upgrade', authenticateToken, beastSkillController.upgradeSkill);
router.post('/forget', authenticateToken, beastSkillController.forgetSkill);
router.post('/train', authenticateToken, beastSkillController.trainSkill);

module.exports = router; 