/**
 * 玩家数据模型
 * Player Data Model
 * 
 * 这个模型定义了游戏玩家的基本信息和资源
 * This model defines basic information and resources for game players
 */

const mongoose = require('mongoose');

// 玩家背包子模型
const InventoryItemSchema = new mongoose.Schema({
  itemId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['equipment', 'consumable', 'material', 'special', 'artifact', 'pill', 'beastEquipment'],
    required: true
  },
  name: String,
  quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  attributes: Object
});

// 玩家模型
const PlayerSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  energy: {
    type: Number,
    default: 100,
    max: 100
  },
  lastEnergyRecharge: {
    type: Date,
    default: Date.now
  },
  resources: {
    gold: { type: Number, default: 100 },
    spiritStone: { type: Number, default: 50 },
    wood: { type: Number, default: 20 },
    ore: { type: Number, default: 20 },
    herb: { type: Number, default: 20 },
    leather: { type: Number, default: 20 }
  },
  attributes: {
    strength: { type: Number, default: 10 },
    agility: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    constitution: { type: Number, default: 10 },
    luck: { type: Number, default: 10 }
  },
  inventory: {
    equipment: [InventoryItemSchema],
    consumables: [InventoryItemSchema],
    materials: [InventoryItemSchema],
    artifacts: [InventoryItemSchema],
    pills: [InventoryItemSchema],
    beastEquipment: [InventoryItemSchema]
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  settings: {
    notifications: { type: Boolean, default: true },
    autoSave: { type: Boolean, default: true }
  },
  currency: {
    type: Number,
    default: 0
  }
});

// 计算升级所需经验值
PlayerSchema.methods.calculateExpForNextLevel = function() {
  return Math.floor(100 * Math.pow(1.5, this.level - 1));
};

// 尝试升级
PlayerSchema.methods.tryLevelUp = function() {
  const expRequired = this.calculateExpForNextLevel();
  
  while (this.experience >= expRequired) {
    this.level += 1;
    this.experience -= expRequired;
  }
  
  return this.level;
};

module.exports = mongoose.model('Player', PlayerSchema); 