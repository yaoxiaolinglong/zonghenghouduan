/**
 * 玩家灵兽数据模型
 * Player Beast Data Model
 * 
 * 这个模型用于记录玩家拥有的灵兽及其状态
 * This model records beasts owned by players and their status
 */

const mongoose = require('mongoose');
const { PlayerBeastEquipmentSchema } = require('./BeastEquipment');

// 探险记录子模式
const ExpeditionSchema = new mongoose.Schema({
  expeditionId: {
    type: String,
    required: true
  },
  type: { 
    type: String, 
    enum: ['resource', 'experience', 'treasure', 'special'],
    required: true 
  },
  location: {
    type: String,
    required: true
  },
  startTime: { 
    type: Date, 
    default: Date.now 
  },
  endTime: { 
    type: Date 
  },
  duration: { 
    type: Number, 
    required: true 
  }, // 小时
  status: { 
    type: String, 
    enum: ['ongoing', 'completed', 'failed'],
    default: 'ongoing' 
  },
  rewards: { 
    type: Object 
  }
});

// 灵兽技能模型
const BeastSkillSchema = new mongoose.Schema({
  skillId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  cooldown: Number,
  damage: Number,
  effects: Object
});

// 灵兽配对历史记录
const PairingHistorySchema = new mongoose.Schema({
  partnerId: {
    type: String, // 配对伙伴的playerBeastId
    required: true
  },
  partnerName: String,
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date,
  bonusType: String,
  bonusValue: Number,
  status: {
    type: String,
    enum: ['active', 'complete', 'failed'],
    default: 'active'
  }
});

const PlayerBeastSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  beastId: { 
    type: String, 
    ref: 'Beast', 
    required: true 
  },
  nickname: { 
    type: String 
  },
  level: { 
    type: Number, 
    default: 1 
  },
  experience: { 
    type: Number, 
    default: 0 
  },
  currentEvolution: { 
    type: Number, 
    default: 0 
  },
  attributes: {
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 10 },
    speed: { type: Number, default: 10 },
    health: { type: Number, default: 100 },
    mana: { type: Number, default: 50 },
    loyalty: { type: Number, default: 50, max: 100 }
  },
  skills: [BeastSkillSchema],
  equipments: [{
    slot: { type: String },
    itemId: { type: String }
  }],
  isDeployed: { 
    type: Boolean, 
    default: false 
  }, // 是否出战或执行任务
  deployPosition: { 
    type: Number 
  }, // 出战位置
  expedition: {
    type: ExpeditionSchema
  }, // 探险任务信息
  expeditionHistory: [ExpeditionSchema], // 历史探险记录
  lastFed: { 
    type: Date 
  },
  lastTrained: { 
    type: Date 
  },
  capturedAt: { 
    type: Date, 
    default: Date.now 
  },
  mood: { 
    type: String, 
    enum: ['happy', 'normal', 'unhappy'], 
    default: 'normal' 
  },
  // 新增配对相关字段
  lastPairedAt: {
    type: Date
  },
  pairHistory: [{
    partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'PlayerBeast' },
    date: { type: Date, default: Date.now },
    effect: { type: String },
    skillGained: { type: String }
  }],
  // 新增字段: 灵兽装备
  equipment: [PlayerBeastEquipmentSchema],
  // 新增字段: 当前探险状态
  currentExpedition: {
    type: ExpeditionSchema,
    default: null
  },
  // 新增字段: 当前配对状态
  currentPairing: {
    type: PairingHistorySchema,
    default: null
  },
  // 新增字段: 配对历史
  pairingHistory: [PairingHistorySchema],
  // 部署状态字段
  deployment: {
    isDeployed: { type: Boolean, default: false },
    location: String,
    startTime: Date,
    task: String
  },
  captureDate: {
    type: Date,
    default: Date.now
  },
  lastFed: {
    type: Date,
    default: Date.now
  },
  lastTrained: Date
});

// 创建复合索引确保每个用户的每个灵兽唯一
PlayerBeastSchema.index({ userId: 1, beastId: 1 }, { unique: true });

// 计算升级所需经验
PlayerBeastSchema.methods.calculateExpForNextLevel = function() {
  return Math.floor(100 * Math.pow(1.5, this.level - 1));
};

// 尝试升级
PlayerBeastSchema.methods.tryLevelUp = function() {
  const expRequired = this.calculateExpForNextLevel();
  
  if (this.experience >= expRequired) {
    this.level += 1;
    this.experience -= expRequired;
    
    // 升级时属性增长
    const growthRate = 1.1; // 10%属性增长
    
    Object.keys(this.attributes).forEach(attr => {
      if (typeof this.attributes[attr] === 'number') {
        this.attributes[attr] = Math.floor(this.attributes[attr] * growthRate);
      }
    });
    
    // 如果有装备，需要重新计算加成
    if (this.equipment && this.equipment.length > 0) {
      this.equipment.forEach(equip => {
        Object.keys(equip.attributes).forEach(attr => {
          if (this.attributes[attr] !== undefined) {
            this.attributes[attr] += equip.attributes[attr];
          }
        });
      });
    }
    
    return true;
  }
  
  return false;
};

module.exports = mongoose.model('PlayerBeast', PlayerBeastSchema); 