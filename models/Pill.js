/**
 * 丹药系统数据模型
 * Pill System Data Model
 * 
 * 这个模型用于定义游戏中的丹药及其效果
 * This model defines pills and their effects in the game
 */

const mongoose = require('mongoose');

const PillSchema = new mongoose.Schema({
  pillId: { 
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
  rarity: { 
    type: String, 
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['attribute', 'cultivation', 'healing', 'special'], 
    required: true 
  },
  effects: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    spirit: { type: Number, default: 0 },
    cultivationBoost: { type: Number, default: 0 },
    healingAmount: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // 持续时间（分钟）
    specialEffect: { type: String }
  },
  realmRequired: {
    type: String,
    ref: 'Realm',
    default: 'realm_001'
  },
  cooldown: { 
    type: Number, 
    default: 24  // 小时
  },
  price: { 
    type: Number, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Pill', PillSchema); 