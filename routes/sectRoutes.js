/**
 * 宗门系统路由
 * Sect System Routes
 * 
 * 定义与宗门系统相关的所有API端点
 * Define all API endpoints related to the sect system
 */

const express = require('express');
const router = express.Router();
const sectController = require('../controllers/sectController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * 1. 公共路由 - 不需要身份验证
 * Public routes - No authentication required
 */

// 获取所有宗门列表 | Get all sects
router.get('/all', sectController.getAllSects);

// 获取宗门详情 | Get sect details
router.get('/:sectId', sectController.getSectById);

// 获取宗门成员列表 | Get sect members
router.get('/:sectId/members', sectController.getSectMembers);

/**
 * 2. 需要身份验证的路由
 * Authenticated routes
 */

// 创建新宗门 | Create a new sect
router.post('/create', authenticateToken, sectController.createSect);

// 获取用户所在宗门信息 | Get user's sect information
router.get('/user/mysect', authenticateToken, sectController.getUserSect);

// 申请加入宗门 | Apply to join a sect
router.post('/apply', authenticateToken, sectController.applyToJoinSect);

// 退出宗门 | Leave sect
router.post('/leave', authenticateToken, sectController.leaveSect);

// 贡献资源给宗门 | Contribute resources to sect
router.post('/contribute', authenticateToken, sectController.contributeToSect);

/**
 * 3. 宗门管理路由 (需要特定宗门职位权限)
 * Sect management routes (require specific sect position privileges)
 * 这些路由需要在控制器中额外检查用户权限
 * These routes require additional permission checks in the controller
 */

// 处理入门申请 | Process join applications
// router.post('/applications/:applicationId', authenticateToken, sectController.processApplication);

// 任命宗门职位 | Assign sect position
// router.post('/member/:userId/position', authenticateToken, sectController.assignPosition);

// 开除宗门成员 | Expel sect member
// router.post('/member/:userId/expel', authenticateToken, sectController.expelMember);

// 更新宗门信息 | Update sect information
// router.put('/update', authenticateToken, sectController.updateSectInfo);

// 管理宗门设施 | Manage sect facilities
// router.post('/facilities/add', authenticateToken, sectController.addFacility);
// router.post('/facilities/:facilityId/upgrade', authenticateToken, sectController.upgradeFacility);

// 管理宗门功法 | Manage sect techniques
// router.post('/techniques/add', authenticateToken, sectController.addTechnique);
// router.post('/techniques/:techniqueId/unlock', authenticateToken, sectController.unlockTechnique);

// 创建宗门任务 | Create sect tasks
// router.post('/tasks/create', authenticateToken, sectController.createTask);
// router.post('/tasks/:taskId/assign', authenticateToken, sectController.assignTask);
// router.post('/tasks/:taskId/complete', authenticateToken, sectController.completeTask);

module.exports = router; 