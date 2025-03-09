/**
 * 灵兽秘境系统数据模型
 * Beast Secret Realm System Data Model
 * 
 * 这个模型定义了灵兽秘境的结构和属性
 * This model defines the structure and attributes of beast secret realms
 */

const mongoose = require('mongoose');
const { generateId } = require('../utils/idGenerator');

// 秘境奖励项模型
const RewardItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['resource', 'equipment', 'currency', 'skill', 'beast', 'special'],
    required: true
  },
  itemId: String,
  name: String,
  quantity: {
    type: Number,
    default: 1
  },
  chance: {
    type: Number,
    min: 0,
    max: 1,
    default: 1
  },
  rarity: {
    type: String,
    enum: ['普通', '稀有', '珍贵', '传说', '神话'],
    default: '普通'
  }
});

// 秘境挑战内容模型
const ChallengeSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['combat', 'puzzle', 'exploration', 'collection', 'boss'],
    required: true
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 10,
    default: 1
  },
  requirementLevel: {
    type: Number,
    default: 1
  },
  recommendedAttributes: {
    attack: Number,
    defense: Number,
    speed: Number,
    health: Number,
    mana: Number
  },
  rewards: [RewardItemSchema],
  optimalBeastTypes: [String], // 最适合的灵兽类型
  specialMechanics: [String]   // 特殊机制
});

// 秘境层级模型
const SecretRealmLevelSchema = new mongoose.Schema({
  levelId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  order: {
    type: Number,
    required: true
  },
  requirementLevel: {
    type: Number,
    default: 1
  },
  challenges: [ChallengeSchema],
  isBossLevel: {
    type: Boolean,
    default: false
  },
  specialConditions: Object,
  rewards: [RewardItemSchema]
});

// 秘境系统主模型
const SecretRealmSchema = new mongoose.Schema({
  realmId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  type: {
    type: String,
    enum: ['fire', 'water', 'earth', 'wind', 'light', 'dark', 'mixed'],
    required: true
  },
  minPlayerLevel: {
    type: Number,
    default: 1
  },
  maxPlayerLevel: {
    type: Number,
    default: 100
  },
  minBeastLevel: {
    type: Number,
    default: 1
  },
  maxBeastCount: {
    type: Number,
    default: 3
  },
  energyCost: {
    type: Number,
    default: 10
  },
  cooldown: {
    type: Number, // 冷却时间（小时）
    default: 24
  },
  isLimited: {
    type: Boolean,
    default: false
  },
  limitedStartTime: Date,
  limitedEndTime: Date,
  levels: [SecretRealmLevelSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 玩家秘境进度模型
const PlayerRealmProgressSchema = new mongoose.Schema({
  playerId: {
    type: String,
    required: true
  },
  realmId: {
    type: String,
    required: true
  },
  completedLevels: [{
    levelId: String,
    completedAt: Date,
    attempts: Number,
    score: Number,
    rewards: [RewardItemSchema]
  }],
  completedChallenges: [{
    challengeId: String,
    levelId: String,
    completedAt: Date,
    attempts: Number,
    success: Boolean,
    rewards: [RewardItemSchema]
  }],
  currentLevel: {
    type: String
  },
  lastEnteredAt: {
    type: Date
  },
  totalRewards: Object,
  bestScore: Number,
  totalAttempts: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 复合索引确保每个玩家的每个秘境进度唯一
PlayerRealmProgressSchema.index({ playerId: 1, realmId: 1 }, { unique: true });

const SecretRealm = mongoose.model('SecretRealm', SecretRealmSchema);
const PlayerRealmProgress = mongoose.model('PlayerRealmProgress', PlayerRealmProgressSchema);

module.exports = {
  SecretRealm,
  PlayerRealmProgress,
  RewardItemSchema,
  ChallengeSchema,
  SecretRealmLevelSchema
}; 