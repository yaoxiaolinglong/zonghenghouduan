/**
 * 法宝系统数据模型
 * Artifact System Data Model
 * 
 * 这个模型用于定义游戏中的法宝及其属性
 * This model defines artifacts and their attributes in the game
 */

const mongoose = require('mongoose');

const ArtifactSchema = new mongoose.Schema({
  artifactId: { 
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
    enum: ['weapon', 'armor', 'accessory', 'flying', 'spirit'], 
    required: true 
  },
  rarity: { 
    type: String, 
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'], 
    required: true 
  },
  level: { 
    type: Number, 
    default: 1 
  },
  realmRequired: {
    type: String,
    ref: 'Realm',
    default: 'realm_001'
  },
  attributes: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    spirit: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 }
  },
  skills: [{
    name: { type: String },
    description: { type: String },
    effect: { type: Object },
    cooldown: { type: Number, default: 0 }
  }],
  upgradeRequirements: {
    spiritStones: { type: Number, default: 0 },
    materials: [{ 
      itemId: { type: String },
      quantity: { type: Number }
    }]
  },
  maxLevel: { 
    type: Number, 
    default: 10 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Artifact', ArtifactSchema); 