/**
 * 灵兽装备数据模型
 * Beast Equipment Data Model
 * 
 * 这个模型定义了灵兽可使用的装备及其属性
 * This model defines the equipment that can be used by beasts and their attributes
 */

const mongoose = require('mongoose');

const BeastEquipmentSchema = new mongoose.Schema({
  equipmentId: {
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
    enum: ['head', 'body', 'feet', 'accessory', 'special'],
    required: true
  },
  rarity: {
    type: String,
    enum: ['普通', '稀有', '珍贵', '传说', '神话'],
    default: '普通'
  },
  levelRequired: {
    type: Number,
    default: 1
  },
  beastTypeRequired: {
    type: [String],
    default: [] // 空数组表示所有类型都可以装备
  },
  attributes: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    mana: { type: Number, default: 0 }
  },
  specialEffects: [{
    name: { type: String },
    description: { type: String },
    effect: { type: Object }
  }],
  durability: {
    current: { type: Number },
    max: { type: Number }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 玩家灵兽装备子模型 - 用于PlayerBeast中的嵌套
const PlayerBeastEquipmentSchema = new mongoose.Schema({
  equipmentId: {
    type: String,
    ref: 'BeastEquipment',
    required: true
  },
  equippedOn: {
    type: String, // 对应灵兽ID
    required: true
  },
  equippedAt: {
    type: Date,
    default: Date.now
  },
  slot: {
    type: String,
    enum: ['head', 'body', 'feet', 'accessory', 'special'],
    required: true
  },
  durability: {
    current: { type: Number },
    max: { type: Number }
  },
  enhancementLevel: {
    type: Number,
    default: 0
  },
  attributes: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    mana: { type: Number, default: 0 }
  }
});

module.exports = {
  BeastEquipment: mongoose.model('BeastEquipment', BeastEquipmentSchema),
  PlayerBeastEquipmentSchema
}; 