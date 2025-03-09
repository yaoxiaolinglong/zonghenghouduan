/**
 * 宗门系统数据模型
 * Sect System Data Model
 * 
 * 定义游戏中宗门及其相关实体的数据结构
 * Define the data structure for sects and related entities in the game
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 宗门职位架构
// Sect position schema
const PositionSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  privileges: {
    canRecruit: {
      type: Boolean,
      default: false
    },
    canExpel: {
      type: Boolean,
      default: false
    },
    canManageResources: {
      type: Boolean,
      default: false
    },
    canAssignTasks: {
      type: Boolean,
      default: false
    },
    canManageFacilities: {
      type: Boolean,
      default: false
    },
    canDistributeBenefits: {
      type: Boolean,
      default: false
    }
  },
  dailyContribution: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  }
});

// 宗门成员架构
// Sect member schema
const MemberSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  position: {
    type: String,
    required: true
  },
  totalContribution: {
    type: Number,
    default: 0
  },
  weeklyContribution: {
    type: Number,
    default: 0
  },
  lastContributionReset: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  }
});

// 宗门设施架构
// Sect facility schema
const FacilitySchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['cultivation', 'production', 'defense', 'special'],
    required: true
  },
  level: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    default: ''
  },
  effects: [{
    type: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      default: ''
    }
  }],
  attributeBonus: {
    type: Map,
    of: Number,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpgraded: {
    type: Date,
    default: Date.now
  }
});

// 宗门功法架构
// Sect technique schema
const TechniqueSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  level: {
    type: Number,
    default: 1
  },
  type: {
    type: String,
    enum: ['cultivation', 'combat', 'special'],
    default: 'cultivation'
  },
  attributes: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  requirements: {
    playerLevel: {
      type: Number,
      default: 1
    },
    contribution: {
      type: Number,
      default: 0
    }
  }
});

// 宗门任务架构
// Sect task schema
const TaskSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 10,
    default: 1
  },
  rewards: {
    experience: {
      type: Number,
      default: 0
    },
    contribution: {
      type: Number,
      default: 0
    },
    resources: [{
      type: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      }
    }]
  },
  requirements: {
    playerLevel: {
      type: Number,
      default: 1
    },
    position: {
      type: Number,
      default: 0
    }
  },
  duration: {
    type: Number,  // 以小时为单位
    default: 24
  },
  assignedTo: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['available', 'assigned', 'completed', 'failed'],
    default: 'available'
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  }
});

// 宗门历史事件架构
// Sect history event schema
const HistoryEventSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  event: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  participants: [{
    type: String
  }]
});

// 宗门主架构
// Main Sect schema
const SectSchema = new Schema({
  sectId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    default: ''
  },
  level: {
    type: Number,
    default: 1
  },
  founderUserId: {
    type: String,
    required: true
  },
  resources: {
    spiritStones: {
      type: Number,
      default: 0
    },
    contributionPoints: {
      type: Number,
      default: 0
    },
    materials: [{
      type: {
        type: String,
        required: true
      },
      amount: {
        type: Number,
        required: true
      }
    }]
  },
  territory: {
    size: {
      type: Number,
      default: 1
    },
    environment: {
      type: String,
      enum: ['mountain', 'forest', 'desert', 'valley', 'plain', 'lake', 'river', 'island'],
      default: 'mountain'
    },
    resourceRichness: {
      type: Number,
      min: 1,
      max: 10,
      default: 3
    },
    dangerLevel: {
      type: Number,
      min: 1,
      max: 10,
      default: 2
    }
  },
  reputation: {
    type: Number,
    default: 0
  },
  positions: [PositionSchema],
  members: [MemberSchema],
  facilities: [FacilitySchema],
  techniques: [TechniqueSchema],
  tasks: [TaskSchema],
  history: [HistoryEventSchema],
  settings: {
    autoAcceptMembers: {
      type: Boolean,
      default: false
    },
    minLevelToJoin: {
      type: Number,
      default: 1
    },
    inviteOnly: {
      type: Boolean,
      default: false
    },
    contributionRequirements: {
      type: Number,
      default: 0
    },
    inactivityThreshold: {
      type: Number,
      default: 30 // 天数
    }
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

// 宗门申请架构
// Sect application schema
const SectApplicationSchema = new Schema({
  sectId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    default: '请求加入宗门'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  processedBy: {
    type: String,
    default: null
  },
  processedDate: {
    type: Date,
    default: null
  },
  comments: {
    type: String,
    default: ''
  }
});

// 创建修改时间的中间件
// Middleware to update the updatedAt field
SectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// 创建宗门申请的唯一索引
// Create unique index for sect applications
SectApplicationSchema.index({ sectId: 1, userId: 1, status: 1 });

const Sect = mongoose.model('Sect', SectSchema);
const SectApplication = mongoose.model('SectApplication', SectApplicationSchema);

module.exports = { Sect, SectApplication }; 