/**
 * 玩家法宝数据模型
 * Player Artifact Data Model
 * 
 * 这个模型用于记录玩家拥有的法宝及其状态
 * This model records artifacts owned by players and their status
 */

const mongoose = require('mongoose');

const PlayerArtifactSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  artifactId: { 
    type: String, 
    ref: 'Artifact', 
    required: true 
  },
  isEquipped: { 
    type: Boolean, 
    default: false 
  },
  level: { 
    type: Number, 
    default: 1 
  },
  experience: { 
    type: Number, 
    default: 0 
  },
  attributes: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    spirit: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 }
  },
  refinementLevel: { 
    type: Number, 
    default: 0 
  }, // 精炼等级，提供额外属性加成
  acquiredAt: { 
    type: Date, 
    default: Date.now 
  },
  lastUsed: { 
    type: Date 
  }
});

// 创建复合索引确保每个用户的每个法宝唯一
PlayerArtifactSchema.index({ userId: 1, artifactId: 1 }, { unique: true });

module.exports = mongoose.model('PlayerArtifact', PlayerArtifactSchema); 