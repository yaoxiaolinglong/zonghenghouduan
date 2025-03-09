/**
 * 境界系统控制器
 * Realm System Controller
 * 
 * 处理境界相关的业务逻辑
 * Handles business logic related to cultivation realms
 */

const Realm = require('../models/Realm');
const Character = require('../models/Character');
const Cultivation = require('../models/Cultivation');
const User = require('../models/User');

// 获取所有境界
exports.getAllRealms = async (req, res) => {
  try {
    const realms = await Realm.find().sort({ level: 1 });
    res.status(200).json(realms);
  } catch (error) {
    console.error('获取境界失败:', error);
    res.status(500).json({ error: '获取境界失败' });
  }
};

// 获取角色当前境界
exports.getCharacterRealm = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    const realm = await Realm.findOne({ realmId: character.realm.realmId });
    if (!realm) {
      return res.status(404).json({ error: '境界不存在' });
    }
    
    res.status(200).json({
      currentRealm: realm,
      progress: character.realm.progress,
      breakthroughAttempts: character.realm.breakthroughAttempts
    });
  } catch (error) {
    console.error('获取角色境界失败:', error);
    res.status(500).json({ error: '获取角色境界失败' });
  }
};

// 尝试境界突破
exports.attemptBreakthrough = async (req, res) => {
  const { userId } = req.body;
  
  try {
    // 获取角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    // 获取当前境界
    const currentRealm = await Realm.findOne({ realmId: character.realm.realmId });
    if (!currentRealm) {
      return res.status(404).json({ error: '当前境界不存在' });
    }
    
    // 检查是否满足突破条件
    if (character.realm.progress < 100) {
      return res.status(400).json({ error: '境界积累不足，无法突破' });
    }
    
    // 获取下一境界
    const nextRealm = await Realm.findOne({ realmId: currentRealm.nextRealm });
    if (!nextRealm) {
      return res.status(400).json({ error: '已达到最高境界' });
    }
    
    // 检查是否满足下一境界的要求
    if (character.level < nextRealm.requirements.playerLevel ||
        character.attributes.spirit < nextRealm.requirements.spirit ||
        character.attributes.intelligence < nextRealm.requirements.intelligence) {
      return res.status(400).json({ 
        error: '属性不足，无法突破',
        requirements: nextRealm.requirements,
        currentAttributes: {
          level: character.level,
          spirit: character.attributes.spirit,
          intelligence: character.attributes.intelligence
        }
      });
    }
    
    // 设置突破状态
    const cultivation = await Cultivation.findOne({ userId });
    if (!cultivation) {
      return res.status(404).json({ error: '修炼记录不存在' });
    }
    
    if (cultivation.status !== 'idle') {
      return res.status(400).json({ error: '当前正在修炼或突破中' });
    }
    
    cultivation.status = 'breakthrough';
    cultivation.startTime = new Date();
    cultivation.currentProgress = 0;
    cultivation.targetProgress = 100;
    cultivation.technique = character.realm.realmId; // 使用当前境界作为突破技巧
    await cultivation.save();
    
    // 增加突破尝试次数
    character.realm.breakthroughAttempts += 1;
    await character.save();
    
    // 计算突破基础成功率
    const baseSuccessRate = calculateBreakthroughRate(character, currentRealm, nextRealm);
    
    res.status(200).json({
      message: '开始境界突破',
      currentRealm: currentRealm.name,
      nextRealm: nextRealm.name,
      baseSuccessRate,
      cultivation
    });
  } catch (error) {
    console.error('境界突破失败:', error);
    res.status(500).json({ error: '境界突破失败' });
  }
};

// 完成境界突破
exports.completeBreakthrough = async (req, res) => {
  const { userId } = req.body;
  
  try {
    // 获取角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    // 获取修炼记录
    const cultivation = await Cultivation.findOne({ userId });
    if (!cultivation || cultivation.status !== 'breakthrough') {
      return res.status(400).json({ error: '未在突破中' });
    }
    
    // 获取当前境界和下一境界
    const currentRealm = await Realm.findOne({ realmId: character.realm.realmId });
    const nextRealm = await Realm.findOne({ realmId: currentRealm.nextRealm });
    
    if (!currentRealm || !nextRealm) {
      return res.status(404).json({ error: '境界信息不存在' });
    }
    
    // 计算突破时间
    const now = new Date();
    const duration = (now - cultivation.startTime) / 1000 / 60; // 分钟
    
    // 计算突破成功率
    const baseSuccessRate = calculateBreakthroughRate(character, currentRealm, nextRealm);
    // 时间因素：至少需要60分钟，每多10分钟增加2%成功率，最多增加30%
    const timeBonus = Math.min(0.3, Math.max(0, duration - 60) / 10 * 0.02);
    // 尝试次数因素：每次失败增加5%成功率，最多增加20%
    const attemptBonus = Math.min(0.2, (character.realm.breakthroughAttempts - 1) * 0.05);
    
    const finalSuccessRate = Math.min(0.95, baseSuccessRate + timeBonus + attemptBonus);
    
    // 随机决定是否突破成功
    const isSuccess = Math.random() < finalSuccessRate;
    
    if (isSuccess) {
      // 突破成功，提升境界
      character.realm.realmId = nextRealm.realmId;
      character.realm.progress = 0;
      character.realm.breakthroughAttempts = 0;
      
      // 应用境界加成
      character.attributes.strength = Math.round(character.attributes.strength * nextRealm.bonuses.strengthMultiplier);
      character.attributes.agility = Math.round(character.attributes.agility * nextRealm.bonuses.agilityMultiplier);
      character.attributes.intelligence = Math.round(character.attributes.intelligence * nextRealm.bonuses.intelligenceMultiplier);
      character.attributes.spirit = Math.round(character.attributes.spirit * nextRealm.bonuses.spiritMultiplier);
    } else {
      // 突破失败，重置进度但保留尝试次数
      character.realm.progress = Math.round(character.realm.progress * 0.7); // 损失30%进度
    }
    
    // 重置修炼状态
    cultivation.status = 'idle';
    cultivation.currentProgress = 0;
    
    await Promise.all([character.save(), cultivation.save()]);
    
    res.status(200).json({
      message: isSuccess ? `突破成功，晋升为${nextRealm.name}` : '突破失败，请再接再厉',
      isSuccess,
      duration,
      successRate: finalSuccessRate,
      currentRealm: isSuccess ? nextRealm : currentRealm,
      updatedCharacter: character
    });
  } catch (error) {
    console.error('完成境界突破失败:', error);
    res.status(500).json({ error: '完成境界突破失败' });
  }
};

// 计算突破成功率
function calculateBreakthroughRate(character, currentRealm, nextRealm) {
  // 基础成功率：根据境界等级差异
  let successRate = 0.5 - (nextRealm.level - currentRealm.level - 1) * 0.1;
  
  // 根据角色等级调整
  const levelDiff = character.level - nextRealm.requirements.playerLevel;
  successRate += levelDiff * 0.01; // 每高出1级增加1%
  
  // 根据角色属性调整
  const spiritDiff = character.attributes.spirit - nextRealm.requirements.spirit;
  const intelligenceDiff = character.attributes.intelligence - nextRealm.requirements.intelligence;
  
  successRate += spiritDiff * 0.005; // 每高出1点灵力增加0.5%
  successRate += intelligenceDiff * 0.005; // 每高出1点悟性增加0.5%
  
  // 确保成功率在合理范围内
  successRate = Math.min(0.7, Math.max(0.05, successRate));
  
  return parseFloat(successRate.toFixed(2));
} 