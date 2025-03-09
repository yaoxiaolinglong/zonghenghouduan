/**
 * 游戏数据初始化脚本
 * Game Data Initialization Script
 * 
 * 用于初始化游戏中的境界、法宝和丹药数据
 * Used to initialize realm, artifact, and pill data in the game
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Realm = require('../models/Realm');
const Artifact = require('../models/Artifact');
const Pill = require('../models/Pill');

// 加载环境变量
dotenv.config();

// 连接数据库
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('数据库连接成功'))
.catch(err => console.error('数据库连接失败:', err));

// 境界数据
const realms = [
  {
    realmId: 'realm_001',
    name: '炼气期',
    level: 1,
    description: '修行的开始，开始感知天地灵气',
    requirements: {
      playerLevel: 1,
      spirit: 10,
      intelligence: 10
    },
    bonuses: {
      spiritMultiplier: 1.0,
      strengthMultiplier: 1.0,
      agilityMultiplier: 1.0,
      intelligenceMultiplier: 1.0,
      cultivationSpeed: 1.0
    },
    abilities: [
      {
        name: '感知灵气',
        description: '能够感知周围的灵气浓度',
        effect: { sensing: 1 }
      }
    ],
    nextRealm: 'realm_002'
  },
  {
    realmId: 'realm_002',
    name: '筑基期',
    level: 2,
    description: '体内筑起灵力基础，灵气开始循环',
    requirements: {
      playerLevel: 10,
      spirit: 100,
      intelligence: 50
    },
    bonuses: {
      spiritMultiplier: 1.2,
      strengthMultiplier: 1.1,
      agilityMultiplier: 1.1,
      intelligenceMultiplier: 1.1,
      cultivationSpeed: 1.2
    },
    abilities: [
      {
        name: '灵气循环',
        description: '灵气在体内自动循环，恢复速度提升',
        effect: { recovery: 1.2 }
      }
    ],
    nextRealm: 'realm_003'
  },
  {
    realmId: 'realm_003',
    name: '金丹期',
    level: 3,
    description: '体内凝结金丹，灵力大幅提升',
    requirements: {
      playerLevel: 20,
      spirit: 200,
      intelligence: 100
    },
    bonuses: {
      spiritMultiplier: 1.5,
      strengthMultiplier: 1.3,
      agilityMultiplier: 1.3,
      intelligenceMultiplier: 1.3,
      cultivationSpeed: 1.5
    },
    abilities: [
      {
        name: '金丹护体',
        description: '金丹形成防护罩，减少伤害',
        effect: { defense: 1.3 }
      }
    ],
    nextRealm: 'realm_004'
  },
  {
    realmId: 'realm_004',
    name: '元婴期',
    level: 4,
    description: '元婴出窍，可短暂离体',
    requirements: {
      playerLevel: 30,
      spirit: 500,
      intelligence: 250
    },
    bonuses: {
      spiritMultiplier: 2.0,
      strengthMultiplier: 1.5,
      agilityMultiplier: 1.5,
      intelligenceMultiplier: 1.5,
      cultivationSpeed: 2.0
    },
    abilities: [
      {
        name: '元婴出窍',
        description: '元婴可短暂离体，探查远处',
        effect: { perception: 2.0 }
      }
    ],
    nextRealm: 'realm_005'
  },
  {
    realmId: 'realm_005',
    name: '化神期',
    level: 5,
    description: '元婴化为神识，寿命大增',
    requirements: {
      playerLevel: 40,
      spirit: 1000,
      intelligence: 500
    },
    bonuses: {
      spiritMultiplier: 3.0,
      strengthMultiplier: 2.0,
      agilityMultiplier: 2.0,
      intelligenceMultiplier: 2.0,
      cultivationSpeed: 3.0
    },
    abilities: [
      {
        name: '神识探查',
        description: '神识可探查方圆百里',
        effect: { perception: 5.0 }
      }
    ],
    nextRealm: null
  }
];

// 法宝数据
const artifacts = [
  {
    artifactId: 'artifact_001',
    name: '青锋剑',
    description: '一把普通的青锋剑，锋利无比',
    type: 'weapon',
    rarity: 'common',
    realmRequired: 'realm_001',
    attributes: {
      attack: 10,
      speed: 5
    },
    upgradeRequirements: {
      spiritStones: 100
    },
    maxLevel: 10
  },
  {
    artifactId: 'artifact_002',
    name: '玄铁护甲',
    description: '由玄铁打造的护甲，坚固耐用',
    type: 'armor',
    rarity: 'uncommon',
    realmRequired: 'realm_001',
    attributes: {
      defense: 15
    },
    upgradeRequirements: {
      spiritStones: 150
    },
    maxLevel: 10
  },
  {
    artifactId: 'artifact_003',
    name: '灵犀玉佩',
    description: '增强灵力的玉佩，有助于修炼',
    type: 'accessory',
    rarity: 'uncommon',
    realmRequired: 'realm_001',
    attributes: {
      spirit: 10,
      intelligence: 5
    },
    upgradeRequirements: {
      spiritStones: 200
    },
    maxLevel: 10
  },
  {
    artifactId: 'artifact_004',
    name: '御风靴',
    description: '穿上后可以御风而行，速度大增',
    type: 'accessory',
    rarity: 'rare',
    realmRequired: 'realm_002',
    attributes: {
      agility: 20,
      speed: 15
    },
    upgradeRequirements: {
      spiritStones: 300
    },
    maxLevel: 15
  },
  {
    artifactId: 'artifact_005',
    name: '赤焰剑',
    description: '蕴含火焰之力的神剑，可释放火焰攻击',
    type: 'weapon',
    rarity: 'rare',
    realmRequired: 'realm_002',
    attributes: {
      attack: 25,
      spirit: 10
    },
    skills: [
      {
        name: '火焰斩',
        description: '释放一道火焰剑气，造成范围伤害',
        effect: { damage: 30, range: 5 },
        cooldown: 60
      }
    ],
    upgradeRequirements: {
      spiritStones: 500
    },
    maxLevel: 20
  },
  {
    artifactId: 'artifact_006',
    name: '五行遁光符',
    description: '可以短距离瞬移的符箓',
    type: 'flying',
    rarity: 'epic',
    realmRequired: 'realm_003',
    attributes: {
      speed: 30,
      agility: 15
    },
    skills: [
      {
        name: '瞬移',
        description: '瞬间移动到指定位置',
        effect: { distance: 100 },
        cooldown: 300
      }
    ],
    upgradeRequirements: {
      spiritStones: 1000
    },
    maxLevel: 20
  },
  {
    artifactId: 'artifact_007',
    name: '太虚灵珠',
    description: '蕴含强大灵力的宝珠，可增强修炼效率',
    type: 'spirit',
    rarity: 'legendary',
    realmRequired: 'realm_004',
    attributes: {
      spirit: 50,
      intelligence: 30
    },
    skills: [
      {
        name: '灵力爆发',
        description: '短时间内大幅提升灵力',
        effect: { spiritBoost: 2.0, duration: 300 },
        cooldown: 3600
      }
    ],
    upgradeRequirements: {
      spiritStones: 2000
    },
    maxLevel: 30
  }
];

// 丹药数据
const pills = [
  {
    pillId: 'pill_001',
    name: '聚气丹',
    description: '初级丹药，有助于聚集灵气，提升修炼效率',
    rarity: 'common',
    type: 'cultivation',
    effects: {
      cultivationBoost: 0.1,
      duration: 60 // 60分钟
    },
    realmRequired: 'realm_001',
    cooldown: 4, // 4小时
    price: 100
  },
  {
    pillId: 'pill_002',
    name: '筋骨丹',
    description: '增强体魄的丹药，提升力量和敏捷',
    rarity: 'common',
    type: 'attribute',
    effects: {
      strength: 5,
      agility: 5,
      duration: 120 // 120分钟
    },
    realmRequired: 'realm_001',
    cooldown: 8, // 8小时
    price: 150
  },
  {
    pillId: 'pill_003',
    name: '灵心丹',
    description: '增强心神的丹药，提升灵力和智力',
    rarity: 'uncommon',
    type: 'attribute',
    effects: {
      spirit: 10,
      intelligence: 10,
      duration: 180 // 180分钟
    },
    realmRequired: 'realm_002',
    cooldown: 12, // 12小时
    price: 300
  },
  {
    pillId: 'pill_004',
    name: '回春丹',
    description: '治疗伤势的丹药，恢复生命力',
    rarity: 'uncommon',
    type: 'healing',
    effects: {
      healingAmount: 100,
      duration: 0 // 立即生效
    },
    realmRequired: 'realm_001',
    cooldown: 1, // 1小时
    price: 200
  },
  {
    pillId: 'pill_005',
    name: '金元丹',
    description: '高级丹药，大幅提升修炼效率',
    rarity: 'rare',
    type: 'cultivation',
    effects: {
      cultivationBoost: 0.3,
      duration: 240 // 240分钟
    },
    realmRequired: 'realm_003',
    cooldown: 24, // 24小时
    price: 800
  },
  {
    pillId: 'pill_006',
    name: '悟道丹',
    description: '开启灵智的丹药，有小概率顿悟',
    rarity: 'epic',
    type: 'special',
    effects: {
      specialEffect: '有10%概率顿悟，获得大量经验',
      duration: 0 // 立即生效
    },
    realmRequired: 'realm_004',
    cooldown: 72, // 72小时
    price: 2000
  },
  {
    pillId: 'pill_007',
    name: '太一金丹',
    description: '传说中的丹药，全面提升各项属性',
    rarity: 'legendary',
    type: 'attribute',
    effects: {
      strength: 30,
      agility: 30,
      intelligence: 30,
      spirit: 30,
      duration: 360 // 360分钟
    },
    realmRequired: 'realm_005',
    cooldown: 168, // 168小时（7天）
    price: 5000
  }
];

// 初始化数据
async function initData() {
  try {
    // 清空现有数据
    await Realm.deleteMany({});
    await Artifact.deleteMany({});
    await Pill.deleteMany({});
    
    // 插入新数据
    await Realm.insertMany(realms);
    await Artifact.insertMany(artifacts);
    await Pill.insertMany(pills);
    
    console.log('游戏数据初始化成功');
    process.exit(0);
  } catch (error) {
    console.error('游戏数据初始化失败:', error);
    process.exit(1);
  }
}

// 执行初始化
initData(); 