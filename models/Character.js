/**
 * 人物角色数据模型
 * Character Data Model
 * 
 * 定义玩家角色的基本属性、状态和能力
 * Define basic attributes, status and abilities of player characters
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 角色装备架构
// Character equipment schema
const EquipmentSchema = new Schema({
  slotName: {
    type: String,
    required: true,
    enum: ['weapon', 'armor', 'helmet', 'boots', 'gloves', 'jewelry', 'accessory']
  },
  itemId: {
    type: String,
    default: null
  },
  name: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  rarity: {
    type: String,
    default: 'common',
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
  },
  level: {
    type: Number,
    default: 1
  },
  attributes: {
    type: Map,
    of: Number,
    default: {}
  },
  equipped: {
    type: Boolean,
    default: false
  },
  equippedAt: {
    type: Date,
    default: null
  }
});

// 角色技能架构
// Character skill schema
const SkillSchema = new Schema({
  skillId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['attack', 'defense', 'support', 'passive', 'ultimate']
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
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
    duration: {
      type: Number,
      default: 0
    },
    probability: {
      type: Number,
      default: 100
    }
  }],
  cooldown: {
    type: Number,
    default: 0
  },
  manaCost: {
    type: Number,
    default: 0
  },
  unlocked: {
    type: Date,
    default: Date.now
  },
  lastUsed: {
    type: Date,
    default: null
  }
});

// 角色历史记录架构
// Character history schema
const HistoryEntrySchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    required: true,
    enum: ['levelUp', 'realmBreakthrough', 'skillLearned', 'itemAcquired', 'questCompleted', 'sectorJoined', 'achievement']
  },
  description: {
    type: String,
    required: true
  },
  details: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  }
});

// 角色成就架构
// Character achievement schema
const AchievementSchema = new Schema({
  achievementId: {
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
  completedAt: {
    type: Date,
    default: Date.now
  },
  rewards: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  }
});

// 人物角色架构
// Character schema
const CharacterSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'male'
  },
  avatar: {
    type: String,
    default: 'default.png'
  },
  level: {
    type: Number,
    default: 1
  },
  experience: {
    type: Number,
    default: 0
  },
  realm: {
    name: {
      type: String,
      default: '练气期'
    },
    level: {
      type: Number,
      default: 1
    },
    progress: {
      type: Number,
      default: 0
    },
    breakthrough: {
      inProgress: {
        type: Boolean,
        default: false
      },
      startTime: {
        type: Date,
        default: null
      },
      requiredProgress: {
        type: Number,
        default: 0
      },
      currentProgress: {
        type: Number,
        default: 0
      }
    }
  },
  attributes: {
    strength: {
      type: Number,
      default: 10
    },
    agility: {
      type: Number,
      default: 10
    },
    intelligence: {
      type: Number,
      default: 10
    },
    constitution: {
      type: Number,
      default: 10
    },
    perception: {
      type: Number,
      default: 10
    },
    luck: {
      type: Number,
      default: 10
    }
  },
  status: {
    health: {
      current: {
        type: Number,
        default: 100
      },
      max: {
        type: Number,
        default: 100
      }
    },
    mana: {
      current: {
        type: Number,
        default: 100
      },
      max: {
        type: Number,
        default: 100
      }
    },
    stamina: {
      current: {
        type: Number,
        default: 100
      },
      max: {
        type: Number,
        default: 100
      }
    },
    cultivation: {
      currentProgress: {
        type: Number,
        default: 0
      },
      rate: {
        type: Number,
        default: 1.0
      },
      state: {
        type: String,
        enum: ['idle', 'cultivating', 'breakthrough', 'recovering'],
        default: 'idle'
      },
      lastStateChange: {
        type: Date,
        default: Date.now
      }
    },
    effects: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        enum: ['buff', 'debuff', 'neutral'],
        default: 'neutral'
      },
      attributes: {
        type: Map,
        of: Number,
        default: {}
      },
      startTime: {
        type: Date,
        default: Date.now
      },
      duration: {
        type: Number,
        default: 0
      },
      source: {
        type: String,
        default: ''
      }
    }]
  },
  equipment: {
    weapon: EquipmentSchema,
    armor: EquipmentSchema,
    helmet: EquipmentSchema,
    boots: EquipmentSchema,
    gloves: EquipmentSchema,
    jewelry: EquipmentSchema,
    accessory: EquipmentSchema
  },
  inventory: {
    capacity: {
      type: Number,
      default: 50
    },
    items: [{
      itemId: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true,
        enum: ['weapon', 'armor', 'consumable', 'material', 'quest', 'misc']
      },
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        default: ''
      },
      quantity: {
        type: Number,
        default: 1
      },
      rarity: {
        type: String,
        default: 'common',
        enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic']
      },
      attributes: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {}
      },
      acquiredAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  skills: [SkillSchema],
  affinities: {
    elements: {
      fire: {
        type: Number,
        default: 0
      },
      water: {
        type: Number,
        default: 0
      },
      earth: {
        type: Number,
        default: 0
      },
      wind: {
        type: Number,
        default: 0
      },
      lightning: {
        type: Number,
        default: 0
      },
      ice: {
        type: Number,
        default: 0
      },
      metal: {
        type: Number,
        default: 0
      },
      wood: {
        type: Number,
        default: 0
      }
    },
    styles: {
      sword: {
        type: Number,
        default: 0
      },
      spear: {
        type: Number,
        default: 0
      },
      blade: {
        type: Number,
        default: 0
      },
      fist: {
        type: Number,
        default: 0
      },
      formation: {
        type: Number,
        default: 0
      },
      alchemy: {
        type: Number,
        default: 0
      },
      talisman: {
        type: Number,
        default: 0
      },
      array: {
        type: Number,
        default: 0
      }
    }
  },
  companions: [{
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['beast', 'spirit', 'weapon', 'familiar'],
      default: 'beast'
    },
    name: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 1
    },
    loyalty: {
      type: Number,
      default: 50,
      min: 0,
      max: 100
    },
    abilities: [{
      name: String,
      description: String,
      level: Number
    }],
    attributes: {
      type: Map,
      of: Number,
      default: {}
    },
    status: {
      type: String,
      enum: ['idle', 'following', 'deployed', 'recovering'],
      default: 'idle'
    }
  }],
  history: [HistoryEntrySchema],
  achievements: [AchievementSchema],
  reputation: {
    general: {
      type: Number,
      default: 0
    },
    factions: [{
      name: {
        type: String,
        required: true
      },
      value: {
        type: Number,
        default: 0
      },
      level: {
        type: String,
        enum: ['hostile', 'unfriendly', 'neutral', 'friendly', 'honored', 'revered'],
        default: 'neutral'
      }
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
});

// 计算经验需求的方法
// Method to calculate experience requirement
CharacterSchema.methods.calculateExpForNextLevel = function() {
  return Math.floor(100 * Math.pow(1.5, this.level - 1));
};

// 尝试升级的方法
// Method to attempt level up
CharacterSchema.methods.tryLevelUp = function() {
  const expRequired = this.calculateExpForNextLevel();
  
  if (this.experience >= expRequired) {
    this.level += 1;
    this.experience -= expRequired;
    this.status.health.max += 10;
    this.status.health.current = this.status.health.max;
    this.status.mana.max += 10;
    this.status.mana.current = this.status.mana.max;
    
    // 记录升级历史
    this.history.push({
      type: 'levelUp',
      description: `升级到 ${this.level} 级`,
      details: {
        oldLevel: this.level - 1,
        newLevel: this.level
      }
    });
    
    return true;
  }
  
  return false;
};

// 计算角色的所有属性（包括装备和效果加成）的方法
// Method to calculate all character attributes (including equipment and effect bonuses)
CharacterSchema.methods.calculateTotalAttributes = function() {
  const baseAttributes = { ...this.attributes };
  const totalAttributes = { ...baseAttributes };
  
  // 添加装备加成
  Object.values(this.equipment).forEach(item => {
    if (item && item.equipped && item.attributes) {
      for (const [key, value] of item.attributes.entries()) {
        if (totalAttributes[key]) {
          totalAttributes[key] += value;
        } else {
          totalAttributes[key] = value;
        }
      }
    }
  });
  
  // 添加状态效果加成
  this.status.effects.forEach(effect => {
    if (effect.attributes) {
      for (const [key, value] of effect.attributes.entries()) {
        if (totalAttributes[key]) {
          totalAttributes[key] += value;
        } else {
          totalAttributes[key] = value;
        }
      }
    }
  });
  
  return totalAttributes;
};

const Character = mongoose.model('Character', CharacterSchema);

module.exports = Character; 