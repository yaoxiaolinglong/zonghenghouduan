/**
 * 玩家丹药数据模型
 * Player Pill Data Model
 * 
 * 这个模型用于记录玩家拥有的丹药及其数量
 * This model records pills owned by players and their quantities
 */

const mongoose = require('mongoose');

const PlayerPillSchema = new mongoose.Schema({
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
  quantity: { 
    type: Number, 
    default: 1, 
    min: 0 
  },
  lastUsed: { 
    type: Date 
  },
  acquiredAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 创建复合索引确保每个用户的每种丹药唯一
PlayerPillSchema.index({ userId: 1, pillId: 1 }, { unique: true });

module.exports = mongoose.model('PlayerPill', PlayerPillSchema); 