/**
 * 修炼系统控制器
 * Cultivation System Controller
 * 
 * 这个控制器处理与修炼系统相关的请求
 * This controller handles requests related to the cultivation system
 */

const Cultivation = require('../models/Cultivation');
const Character = require('../models/Character');
const User = require('../models/User');

// 开始修炼
exports.startCultivation = async (req, res) => {
  const { userId, techniqueId, location } = req.body;
  
  try {
    // 检查玩家是否已在修炼
    let cultivation = await Cultivation.findOne({ userId });
    
    if (cultivation && cultivation.status !== 'idle') {
      return res.status(400).json({ error: '玩家已在修炼中' });
    }
    
    // 获取角色信息计算修炼效率
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    // 计算修炼效率
    const efficiency = calculateEfficiency(character, techniqueId, location);
    
    // 创建或更新修炼记录
    if (!cultivation) {
      cultivation = new Cultivation({
        userId,
        status: 'cultivating',
        startTime: new Date(),
        technique: techniqueId,
        location: location || 'default',
        efficiency,
        currentProgress: 0,
        targetProgress: 100,
        lastUpdated: new Date()
      });
    } else {
      cultivation.status = 'cultivating';
      cultivation.startTime = new Date();
      cultivation.technique = techniqueId;
      cultivation.location = location || 'default';
      cultivation.efficiency = efficiency;
      cultivation.currentProgress = 0;
      cultivation.targetProgress = 100;
      cultivation.lastUpdated = new Date();
    }
    
    await cultivation.save();
    
    res.status(200).json({
      message: '开始修炼',
      cultivation
    });
  } catch (error) {
    console.error('开始修炼失败:', error);
    res.status(500).json({ error: '开始修炼失败' });
  }
};

// 结束修炼
exports.endCultivation = async (req, res) => {
  const { userId } = req.body;
  
  try {
    // 查找修炼记录
    const cultivation = await Cultivation.findOne({ userId });
    
    if (!cultivation || cultivation.status === 'idle') {
      return res.status(400).json({ error: '玩家未在修炼中' });
    }
    
    // 计算修炼时间和获得的经验
    const now = new Date();
    const duration = (now - cultivation.startTime) / 1000 / 60; // 分钟
    const gainedExperience = Math.floor(duration * cultivation.efficiency);
    
    // 更新角色经验和资源
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    character.experience += gainedExperience;
    
    // 根据修炼效率和时间增加灵力
    const spiritGain = Math.floor(duration * cultivation.efficiency * 0.5);
    character.attributes.spirit += spiritGain;
    
    // 检查是否升级
    let levelUp = false;
    if (character.experience >= 100) {
      const levelGain = Math.floor(character.experience / 100);
      character.level += levelGain;
      character.experience %= 100;
      levelUp = true;
      
      // 同步更新用户等级
      await User.findByIdAndUpdate(userId, { 
        level: character.level,
        experience: character.experience
      });
    }
    
    // 更新修炼状态
    cultivation.status = 'idle';
    cultivation.currentProgress = 0;
    cultivation.lastUpdated = new Date();
    
    await Promise.all([character.save(), cultivation.save()]);
    
    res.status(200).json({
      message: '结束修炼',
      duration,
      gainedExperience,
      spiritGain,
      levelUp,
      updatedCharacter: character
    });
  } catch (error) {
    console.error('结束修炼失败:', error);
    res.status(500).json({ error: '结束修炼失败' });
  }
};

// 获取修炼状态
exports.getCultivationStatus = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const cultivation = await Cultivation.findOne({ userId });
    
    if (!cultivation) {
      return res.status(404).json({ error: '修炼记录不存在' });
    }
    
    // 如果正在修炼，计算当前进度
    if (cultivation.status === 'cultivating') {
      const now = new Date();
      const duration = (now - cultivation.startTime) / 1000 / 60; // 分钟
      const progress = Math.min(100, Math.floor(duration * cultivation.efficiency));
      cultivation.currentProgress = progress;
      
      // 不保存，只是为了显示
    }
    
    res.status(200).json(cultivation);
  } catch (error) {
    console.error('获取修炼状态失败:', error);
    res.status(500).json({ error: '获取修炼状态失败' });
  }
};

// 尝试突破
exports.attemptBreakthrough = async (req, res) => {
  const { userId } = req.body;
  
  try {
    // 获取角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    // 获取修炼记录
    let cultivation = await Cultivation.findOne({ userId });
    if (!cultivation) {
      cultivation = new Cultivation({ userId });
      await cultivation.save();
    }
    
    // 检查是否已在突破中
    if (cultivation.status === 'breakthrough') {
      return res.status(400).json({ error: '玩家已在突破中' });
    }
    
    // 计算突破成功率
    const successRate = calculateBreakthroughRate(character);
    
    // 设置突破状态
    cultivation.status = 'breakthrough';
    cultivation.startTime = new Date();
    cultivation.currentProgress = 0;
    cultivation.targetProgress = 100;
    cultivation.lastUpdated = new Date();
    
    await cultivation.save();
    
    res.status(200).json({
      message: '开始突破',
      successRate,
      cultivation
    });
  } catch (error) {
    console.error('尝试突破失败:', error);
    res.status(500).json({ error: '尝试突破失败' });
  }
};

// 完成突破
exports.completeBreakthrough = async (req, res) => {
  const { userId } = req.body;
  
  try {
    // 获取修炼记录
    const cultivation = await Cultivation.findOne({ userId });
    if (!cultivation || cultivation.status !== 'breakthrough') {
      return res.status(400).json({ error: '玩家未在突破中' });
    }
    
    // 获取角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    // 计算突破时间
    const now = new Date();
    const duration = (now - cultivation.startTime) / 1000 / 60; // 分钟
    
    // 计算突破成功率
    const baseSuccessRate = calculateBreakthroughRate(character);
    // 时间因素：至少需要30分钟，每多10分钟增加5%成功率，最多增加30%
    const timeBonus = Math.min(0.3, Math.max(0, duration - 30) / 10 * 0.05);
    const finalSuccessRate = baseSuccessRate + timeBonus;
    
    // 随机决定是否突破成功
    const isSuccess = Math.random() < finalSuccessRate;
    
    if (isSuccess) {
      // 突破成功，提升属性
      character.attributes.spirit += 10;
      character.attributes.intelligence += 5;
      
      // 可以在这里添加境界提升的逻辑
    }
    
    // 重置修炼状态
    cultivation.status = 'idle';
    cultivation.currentProgress = 0;
    cultivation.lastUpdated = new Date();
    
    await Promise.all([character.save(), cultivation.save()]);
    
    res.status(200).json({
      message: isSuccess ? '突破成功' : '突破失败',
      isSuccess,
      duration,
      successRate: finalSuccessRate,
      updatedCharacter: character
    });
  } catch (error) {
    console.error('完成突破失败:', error);
    res.status(500).json({ error: '完成突破失败' });
  }
};

// 计算修炼效率
function calculateEfficiency(character, techniqueId, location) {
  // 基础效率
  let efficiency = 1.0;
  
  // 根据角色属性调整效率
  efficiency += character.attributes.intelligence * 0.01;
  efficiency += character.attributes.spirit * 0.02;
  
  // 根据功法加成调整效率（这里简化处理）
  if (techniqueId) {
    // 不同功法有不同加成，这里简单处理
    const techniqueBonus = {
      'skill_001': 1.1,  // 吐纳术
      'skill_002': 1.2   // 御剑术
    };
    
    if (techniqueBonus[techniqueId]) {
      efficiency *= techniqueBonus[techniqueId];
    }
  }
  
  // 根据修炼地点调整效率
  if (location) {
    const locationBonus = {
      'default': 1.0,
      'sect': 1.2,       // 宗门
      'mountain': 1.3,   // 灵山
      'cave': 1.5        // 洞府
    };
    
    if (locationBonus[location]) {
      efficiency *= locationBonus[location];
    }
  }
  
  return parseFloat(efficiency.toFixed(2));
}

// 计算突破成功率
function calculateBreakthroughRate(character) {
  // 基础成功率
  let successRate = 0.3;
  
  // 根据角色等级调整
  successRate -= character.level * 0.01; // 等级越高越难
  
  // 根据角色属性调整
  successRate += character.attributes.intelligence * 0.005;
  successRate += character.attributes.spirit * 0.01;
  
  // 确保成功率在合理范围内
  successRate = Math.min(0.9, Math.max(0.1, successRate));
  
  return parseFloat(successRate.toFixed(2));
} 