/**
 * 修炼系统数据模型
 * Cultivation System Data Model
 * 
 * 这个模型用于存储玩家的修炼状态和进度
 * This model is used to store player's cultivation status and progress
 */

const mongoose = require('mongoose');

const CultivationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['idle', 'cultivating', 'breakthrough'], 
    default: 'idle' 
  },
  startTime: { 
    type: Date 
  },
  technique: { 
    type: String,
    ref: 'Skill'
  },
  efficiency: { 
    type: Number, 
    default: 1.0 
  },
  currentProgress: { 
    type: Number, 
    default: 0 
  },
  targetProgress: { 
    type: Number, 
    default: 100 
  },
  location: {
    type: String,
    default: 'default'
  },
  bonusFactors: {
    environment: { type: Number, default: 1.0 },
    items: { type: Number, default: 1.0 },
    sect: { type: Number, default: 1.0 }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cultivation', CultivationSchema); 