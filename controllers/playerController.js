/**
 * 玩家系统控制器
 * Player System Controller
 * 
 * 处理与玩家相关的操作：创建、获取、更新等
 * Handles operations related to players: creation, retrieval, updates, etc.
 */

const Player = require('../models/Player');
const { generateId } = require('../utils/idGenerator');

/**
 * 创建新玩家
 * Create a new player
 */
const createPlayer = async (req, res) => {
  try {
    const { name, userId } = req.body;
    
    // 检查是否已存在该用户的玩家角色
    const existingPlayer = await Player.findOne({ userId });
    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: '该用户已有玩家角色'
      });
    }
    
    // 创建新玩家
    const player = new Player({
      playerId: 'P' + generateId(),
      userId,
      name
    });
    
    await player.save();
    
    res.status(201).json({
      success: true,
      message: '玩家创建成功',
      data: player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '玩家创建失败',
      error: error.message
    });
  }
};

/**
 * 获取玩家信息
 * Get player information
 */
const getPlayer = async (req, res) => {
  try {
    const playerId = req.user.id;
    
    const player = await Player.findOne({ playerId });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: '玩家不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取玩家信息失败',
      error: error.message
    });
  }
};

/**
 * 更新玩家信息
 * Update player information
 */
const updatePlayer = async (req, res) => {
  try {
    const playerId = req.user.id;
    const updateData = req.body;
    
    // 移除不允许更新的字段
    delete updateData.playerId;
    delete updateData.userId;
    delete updateData.experience;
    delete updateData.level;
    delete updateData.resources;
    delete updateData.currency;
    
    const player = await Player.findOneAndUpdate(
      { playerId },
      updateData,
      { new: true }
    );
    
    if (!player) {
      return res.status(404).json({
        success: false,
        message: '玩家不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      message: '玩家信息更新成功',
      data: player
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新玩家信息失败',
      error: error.message
    });
  }
};

/**
 * 获取玩家背包
 * Get player inventory
 */
const getPlayerInventory = async (req, res) => {
  try {
    const playerId = req.user.id;
    
    const player = await Player.findOne({ playerId });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: '玩家不存在'
      });
    }
    
    res.status(200).json({
      success: true,
      data: player.inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取玩家背包失败',
      error: error.message
    });
  }
};

/**
 * 添加物品到玩家背包
 * Add item to player inventory
 */
const addItemToInventory = async (req, res) => {
  try {
    const playerId = req.user.id;
    const { itemType, itemId, quantity = 1, name, attributes } = req.body;
    
    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: '物品类型和ID是必填项'
      });
    }
    
    const player = await Player.findOne({ playerId });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: '玩家不存在'
      });
    }
    
    // 根据物品类型选择对应的背包分类
    let inventoryCategory;
    switch (itemType) {
      case 'equipment':
        inventoryCategory = 'equipment';
        break;
      case 'consumable':
        inventoryCategory = 'consumables';
        break;
      case 'material':
        inventoryCategory = 'materials';
        break;
      case 'artifact':
        inventoryCategory = 'artifacts';
        break;
      case 'pill':
        inventoryCategory = 'pills';
        break;
      case 'beastEquipment':
        inventoryCategory = 'beastEquipment';
        break;
      default:
        inventoryCategory = 'materials';
    }
    
    // 检查物品是否已存在于背包中
    const existingItemIndex = player.inventory[inventoryCategory].findIndex(
      item => item.itemId === itemId
    );
    
    if (existingItemIndex !== -1) {
      // 如果物品已存在，增加数量
      player.inventory[inventoryCategory][existingItemIndex].quantity += quantity;
    } else {
      // 如果物品不存在，添加新物品
      player.inventory[inventoryCategory].push({
        itemId,
        type: itemType,
        name: name || '未知物品',
        quantity,
        attributes: attributes || {}
      });
    }
    
    await player.save();
    
    res.status(200).json({
      success: true,
      message: '物品添加成功',
      data: player.inventory[inventoryCategory]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加物品失败',
      error: error.message
    });
  }
};

/**
 * 从玩家背包移除物品
 * Remove item from player inventory
 */
const removeItemFromInventory = async (req, res) => {
  try {
    const playerId = req.user.id;
    const { itemType, itemId, quantity = 1 } = req.body;
    
    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: '物品类型和ID是必填项'
      });
    }
    
    const player = await Player.findOne({ playerId });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: '玩家不存在'
      });
    }
    
    // 根据物品类型选择对应的背包分类
    let inventoryCategory;
    switch (itemType) {
      case 'equipment':
        inventoryCategory = 'equipment';
        break;
      case 'consumable':
        inventoryCategory = 'consumables';
        break;
      case 'material':
        inventoryCategory = 'materials';
        break;
      case 'artifact':
        inventoryCategory = 'artifacts';
        break;
      case 'pill':
        inventoryCategory = 'pills';
        break;
      case 'beastEquipment':
        inventoryCategory = 'beastEquipment';
        break;
      default:
        inventoryCategory = 'materials';
    }
    
    // 检查物品是否存在于背包中
    const existingItemIndex = player.inventory[inventoryCategory].findIndex(
      item => item.itemId === itemId
    );
    
    if (existingItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '物品不存在于背包中'
      });
    }
    
    // 减少物品数量
    const item = player.inventory[inventoryCategory][existingItemIndex];
    if (item.quantity <= quantity) {
      // 如果移除的数量大于等于现有数量，移除整个物品
      player.inventory[inventoryCategory].splice(existingItemIndex, 1);
    } else {
      // 否则减少数量
      item.quantity -= quantity;
    }
    
    await player.save();
    
    res.status(200).json({
      success: true,
      message: '物品移除成功',
      data: player.inventory[inventoryCategory]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '移除物品失败',
      error: error.message
    });
  }
};

module.exports = {
  createPlayer,
  getPlayer,
  updatePlayer,
  getPlayerInventory,
  addItemToInventory,
  removeItemFromInventory
}; 