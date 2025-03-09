/**
 * 丹药效果数据模型
 * Pill Effect Data Model
 * 
 * 这个模型用于记录丹药在玩家身上的生效状态
 * This model records the active effects of pills on players
 */

const mongoose = require('mongoose');

const PillEffectSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  pillId: { 
    type: String, 
    ref: 'Pill', 
    required: true 
  },
  startTime: { 
    type: Date, 
    default: Date.now 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  effects: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    spirit: { type: Number, default: 0 },
    cultivationBoost: { type: Number, default: 0 }
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
});

module.exports = mongoose.model('PillEffect', PillEffectSchema); 