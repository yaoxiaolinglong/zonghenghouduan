const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  reward: {
    experience: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    spiritStones: { type: Number, default: 0 }
  },
  condition: { type: String }, // 完成条件描述，例如 "击败敌人10次"
  difficulty: { type: String, enum: ['简单', '普通', '困难'], default: '普通' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema); 