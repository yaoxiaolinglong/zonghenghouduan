const express = require('express');
const router = express.Router();
const CharacterController = require('../controllers/characterController');

// 获取角色信息
router.get('/:userId', CharacterController.getCharacter);

// 更新角色信息
router.put('/:userId', CharacterController.updateCharacter);

module.exports = router; 