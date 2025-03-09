const mongoose = require('mongoose');
require('dotenv').config();

// 连接数据库
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('数据库连接成功'))
.catch(err => console.error('数据库连接失败', err));

// 定义集合的Schema
const collections = {
  // 玩家集合
  players: new mongoose.Schema({
    name: { type: String, required: true },
    level: { type: Number, required: true, min: 1 },
    spirit: { type: Number, required: true, min: 0 },
    physique: { type: Number, required: true, min: 0 },
    comprehension: { type: Number, required: true, min: 0 },
    stones: { type: Number, required: true, min: 0 },
    total_cultivations: { type: Number, required: true, min: 0 },
    inventory_capacity: { type: Number, required: true, min: 0 },
    equipped_artifact: String,
    sound_enabled: Boolean,
    auto_save_enabled: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  }),

  // 物品集合
  items: new mongoose.Schema({
    item_id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['pill', 'artifact', 'stone'], required: true },
    rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], required: true },
    spirit_effect: Number,
    physique_effect: Number,
    comprehension_effect: Number,
    spirit_bonus: Number,
    physique_bonus: Number,
    comprehension_bonus: Number,
    value: Number,
    price: { type: Number, required: true },
    stackable: Boolean,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  }),

  // 技能集合
  skills: new mongoose.Schema({
    skill_id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['basic', 'advanced', 'special'], required: true },
    level_required: { type: Number, required: true, min: 1 },
    spirit_required: Number,
    physique_required: Number,
    comprehension_required: Number,
    spirit_bonus: Number,
    physique_bonus: Number,
    comprehension_bonus: Number,
    cultivation_bonus: Number,
    price: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  }),

  // 任务集合
  quests: new mongoose.Schema({
    quest_id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    type: { type: String, enum: ['main', 'side', 'daily', 'weekly', 'achievement'], required: true },
    category: { type: String, enum: ['combat', 'collection', 'exploration', 'cultivation'], required: true },
    level: { type: Number, required: true },
    player_level_required: { type: Number, required: true },
    realm_id: String,
    time_limit: Number,
    cooldown: Number,
    is_repeatable: Boolean,
    npc_id: { type: String, required: true },
    area_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
  })
};

// 为每个Schema添加索引
collections.items.index({ item_id: 1 }, { unique: true });
collections.skills.index({ skill_id: 1 }, { unique: true });
collections.quests.index({ quest_id: 1 }, { unique: true });

// 创建模型
const models = {};
for (const [name, schema] of Object.entries(collections)) {
  models[name] = mongoose.model(name, schema);
}

// 初始化数据
const initData = async () => {
  try {
    // 清空所有集合
    for (const model of Object.values(models)) {
      await model.deleteMany({});
    }

    // 创建初始物品
    const items = [
      {
        item_id: 'pill_001',
        name: '聚气丹',
        description: '提升灵力的丹药',
        type: 'pill',
        rarity: 'common',
        spirit_effect: 10,
        price: 100,
        stackable: true
      },
      {
        item_id: 'artifact_001',
        name: '青锋剑',
        description: '入门级法器',
        type: 'artifact',
        rarity: 'uncommon',
        spirit_bonus: 5,
        price: 500,
        stackable: false
      }
    ];
    await models.items.insertMany(items);

    // 创建初始技能
    const skills = [
      {
        skill_id: 'skill_001',
        name: '吐纳术',
        description: '基础修炼功法',
        type: 'basic',
        level_required: 1,
        spirit_required: 0,
        cultivation_bonus: 1.1,
        price: 100
      },
      {
        skill_id: 'skill_002',
        name: '御剑术',
        description: '基础剑法',
        type: 'basic',
        level_required: 5,
        spirit_required: 100,
        spirit_bonus: 10,
        price: 500
      }
    ];
    await models.skills.insertMany(skills);

    // 创建初始任务
    const quests = [
      {
        quest_id: 'quest_001',
        name: '初入修仙',
        description: '完成基础修炼',
        type: 'main',
        category: 'cultivation',
        level: 1,
        player_level_required: 1,
        is_repeatable: false,
        npc_id: 'npc_001',
        area_id: 'area_001'
      },
      {
        quest_id: 'quest_002',
        name: '采集灵草',
        description: '收集10株灵草',
        type: 'daily',
        category: 'collection',
        level: 1,
        player_level_required: 1,
        is_repeatable: true,
        npc_id: 'npc_002',
        area_id: 'area_002'
      }
    ];
    await models.quests.insertMany(quests);

    console.log('数据初始化成功');
  } catch (error) {
    console.error('数据初始化失败:', error);
  } finally {
    mongoose.disconnect();
  }
};

// 执行初始化
initData(); 