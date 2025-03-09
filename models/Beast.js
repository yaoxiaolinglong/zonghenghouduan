/**
 * 灵兽数据模型
 * Beast Data Model
 * 
 * 这个模型定义了游戏中所有灵兽的基本属性和特性
 * This model defines the basic attributes and characteristics of all beasts in the game
 */

const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  damage: { type: Number, default: 0 },
  healAmount: { type: Number, default: 0 },
  buffEffect: { type: Object },
  cooldown: { type: Number, default: 1 },
  unlockLevel: { type: Number, default: 1 },
  targeting: { 
    type: String, 
    enum: ['single', 'all', 'self', 'ally'], 
    default: 'single' 
  },
  manaCost: { type: Number, default: 10 }
});

const EvolutionPathSchema = new mongoose.Schema({
  stage: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String },
  requiredLevel: { type: Number, required: true },
  requiredItems: [{
    itemId: { type: String },
    quantity: { type: Number, default: 1 }
  }],
  statBoosts: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    mana: { type: Number, default: 0 }
  },
  newSkills: [{ type: String }],
  image: { type: String }
});

const BeastSchema = new mongoose.Schema({
  beastId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ['火灵', '水灵', '木灵', '土灵', '金灵', '风灵', '雷灵', '光灵', '暗灵', '神兽'], 
    required: true 
  },
  rarity: { 
    type: String, 
    enum: ['普通', '稀有', '珍贵', '传说', '神话'], 
    default: '普通' 
  },
  baseLevel: { 
    type: Number, 
    default: 1 
  },
  growthRate: { 
    type: Number, 
    default: 1.0 
  }, // 成长系数，影响升级后的属性提升
  realmRequired: { 
    type: String,
    default: '练气期' 
  }, // 捕获所需修为
  baseAttributes: {
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 10 },
    speed: { type: Number, default: 10 },
    health: { type: Number, default: 100 },
    mana: { type: Number, default: 50 }
  },
  skills: [SkillSchema],
  evolutionPaths: [EvolutionPathSchema],
  captureRate: { 
    type: Number, 
    default: 0.1 
  }, // 捕获几率0-1
  habitat: { 
    type: String, 
    enum: ['山林', '水域', '洞穴', '平原', '天空', '秘境'], 
    default: '山林' 
  },
  image: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Beast', BeastSchema); 