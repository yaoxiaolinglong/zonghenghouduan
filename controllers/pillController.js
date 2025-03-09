/**
 * 丹药系统控制器
 * Pill System Controller
 * 
 * 处理丹药相关的业务逻辑
 * Handles business logic related to pills
 */

const Pill = require('../models/Pill');
const PlayerPill = require('../models/PlayerPill');
const PillEffect = require('../models/PillEffect');
const Character = require('../models/Character');
const User = require('../models/User');
const Realm = require('../models/Realm');

// 获取所有丹药
exports.getAllPills = async (req, res) => {
  try {
    const pills = await Pill.find();
    res.status(200).json(pills);
  } catch (error) {
    console.error('获取丹药失败:', error);
    res.status(500).json({ error: '获取丹药失败' });
  }
};

// 获取丹药详情
exports.getPillDetails = async (req, res) => {
  const { pillId } = req.params;
  
  try {
    const pill = await Pill.findOne({ pillId });
    if (!pill) {
      return res.status(404).json({ error: '丹药不存在' });
    }
    
    res.status(200).json(pill);
  } catch (error) {
    console.error('获取丹药详情失败:', error);
    res.status(500).json({ error: '获取丹药详情失败' });
  }
};

// 获取玩家拥有的丹药
exports.getPlayerPills = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const playerPills = await PlayerPill.find({ userId });
    
    // 获取丹药详细信息
    const pillDetails = await Promise.all(
      playerPills.map(async (playerPill) => {
        const pill = await Pill.findOne({ pillId: playerPill.pillId });
        return {
          ...playerPill.toObject(),
          details: pill
        };
      })
    );
    
    res.status(200).json(pillDetails);
  } catch (error) {
    console.error('获取玩家丹药失败:', error);
    res.status(500).json({ error: '获取玩家丹药失败' });
  }
};

// 获取丹药
exports.acquirePill = async (req, res) => {
  const { userId, pillId, quantity = 1 } = req.body;
  
  try {
    // 检查丹药是否存在
    const pill = await Pill.findOne({ pillId });
    if (!pill) {
      return res.status(404).json({ error: '丹药不存在' });
    }
    
    // 检查用户是否已拥有该丹药
    let playerPill = await PlayerPill.findOne({ userId, pillId });
    
    if (playerPill) {
      // 已有丹药，增加数量
      playerPill.quantity += quantity;
    } else {
      // 没有丹药，创建新记录
      playerPill = new PlayerPill({
        userId,
        pillId,
        quantity
      });
    }
    
    await playerPill.save();
    
    res.status(200).json({
      message: `获得丹药：${pill.name} x${quantity}`,
      playerPill: {
        ...playerPill.toObject(),
        details: pill
      }
    });
  } catch (error) {
    console.error('获取丹药失败:', error);
    res.status(500).json({ error: '获取丹药失败' });
  }
};

// 使用丹药
exports.usePill = async (req, res) => {
  const { userId, pillId } = req.body;
  
  try {
    // 检查玩家是否拥有该丹药
    const playerPill = await PlayerPill.findOne({ userId, pillId });
    if (!playerPill || playerPill.quantity <= 0) {
      return res.status(404).json({ error: '您没有这个丹药' });
    }
    
    // 获取丹药详情
    const pill = await Pill.findOne({ pillId });
    if (!pill) {
      return res.status(404).json({ error: '丹药不存在' });
    }
    
    // 获取角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    // 检查境界要求
    if (pill.realmRequired && character.realm.realmId !== pill.realmRequired) {
      const requiredRealm = await Realm.findOne({ realmId: pill.realmRequired });
      return res.status(400).json({ 
        error: '境界不足，无法使用此丹药', 
        required: requiredRealm.name,
        current: character.realm.realmId 
      });
    }
    
    // 检查冷却时间
    if (playerPill.lastUsed) {
      const lastUsedTime = new Date(playerPill.lastUsed);
      const currentTime = new Date();
      const hoursDiff = (currentTime - lastUsedTime) / (1000 * 60 * 60);
      
      if (hoursDiff < pill.cooldown) {
        const remainingHours = Math.ceil(pill.cooldown - hoursDiff);
        return res.status(400).json({ 
          error: `丹药冷却中，还需等待 ${remainingHours} 小时` 
        });
      }
    }
    
    // 减少丹药数量
    playerPill.quantity -= 1;
    playerPill.lastUsed = new Date();
    await playerPill.save();
    
    // 根据丹药类型应用效果
    let result = {};
    
    switch (pill.type) {
      case 'attribute':
        // 属性丹药，临时提升属性
        result = await applyAttributePill(userId, pill);
        break;
        
      case 'cultivation':
        // 修炼丹药，提升修炼效率
        result = await applyCultivationPill(userId, pill);
        break;
        
      case 'healing':
        // 疗伤丹药，恢复生命值（未实现）
        result = {
          message: `使用了疗伤丹药：${pill.name}`,
          healingAmount: pill.effects.healingAmount
        };
        break;
        
      case 'special':
        // 特殊丹药，有特殊效果
        result = {
          message: `使用了特殊丹药：${pill.name}`,
          specialEffect: pill.effects.specialEffect
        };
        break;
    }
    
    res.status(200).json({
      message: `成功使用丹药：${pill.name}`,
      remainingQuantity: playerPill.quantity,
      ...result
    });
  } catch (error) {
    console.error('使用丹药失败:', error);
    res.status(500).json({ error: '使用丹药失败' });
  }
};

// 获取当前生效的丹药效果
exports.getActiveEffects = async (req, res) => {
  const { userId } = req.params;
  
  try {
    // 获取当前时间
    const now = new Date();
    
    // 查找所有生效中的丹药效果
    const activeEffects = await PillEffect.find({
      userId,
      isActive: true,
      endTime: { $gt: now }
    });
    
    // 获取丹药详细信息
    const effectDetails = await Promise.all(
      activeEffects.map(async (effect) => {
        const pill = await Pill.findOne({ pillId: effect.pillId });
        return {
          ...effect.toObject(),
          pillDetails: pill,
          remainingTime: Math.round((effect.endTime - now) / (1000 * 60)) // 剩余分钟
        };
      })
    );
    
    res.status(200).json(effectDetails);
  } catch (error) {
    console.error('获取丹药效果失败:', error);
    res.status(500).json({ error: '获取丹药效果失败' });
  }
};

// 应用属性丹药效果
async function applyAttributePill(userId, pill) {
  // 创建丹药效果记录
  const now = new Date();
  const endTime = new Date(now.getTime() + pill.effects.duration * 60 * 1000);
  
  const pillEffect = new PillEffect({
    userId,
    pillId: pill.pillId,
    startTime: now,
    endTime,
    effects: {
      strength: pill.effects.strength,
      agility: pill.effects.agility,
      intelligence: pill.effects.intelligence,
      spirit: pill.effects.spirit
    }
  });
  
  await pillEffect.save();
  
  return {
    message: `属性提升效果将持续 ${pill.effects.duration} 分钟`,
    effects: pillEffect.effects,
    endTime
  };
}

// 应用修炼丹药效果
async function applyCultivationPill(userId, pill) {
  // 获取当前修炼状态
  const cultivation = await require('../models/Cultivation').findOne({ userId });
  
  if (!cultivation || cultivation.status !== 'cultivating') {
    return { message: '未在修炼状态，丹药效果无法应用' };
  }
  
  // 创建丹药效果记录
  const now = new Date();
  const endTime = new Date(now.getTime() + pill.effects.duration * 60 * 1000);
  
  const pillEffect = new PillEffect({
    userId,
    pillId: pill.pillId,
    startTime: now,
    endTime,
    effects: {
      cultivationBoost: pill.effects.cultivationBoost
    }
  });
  
  await pillEffect.save();
  
  // 更新修炼效率
  const originalEfficiency = cultivation.efficiency;
  cultivation.efficiency = originalEfficiency * (1 + pill.effects.cultivationBoost);
  cultivation.lastUpdated = now;
  
  await cultivation.save();
  
  return {
    message: `修炼效率提升 ${pill.effects.cultivationBoost * 100}%，将持续 ${pill.effects.duration} 分钟`,
    originalEfficiency,
    newEfficiency: cultivation.efficiency,
    endTime
  };
} 