/**
 * 灵兽系统控制器（修复版）
 * Beast System Controller (Fixed Version)
 * 
 * 处理灵兽相关的所有业务逻辑
 * Handles all business logic related to the beast system
 */

const Beast = require('../models/Beast');
const PlayerBeast = require('../models/PlayerBeast');
const Character = require('../models/Character');
const mongoose = require('mongoose');

// 初始化一些默认灵兽数据
const initializeBeasts = async () => {
  try {
    // 检查是否已经有灵兽数据
    const beastCount = await Beast.countDocuments();
    
    if (beastCount === 0) {
      // 预设一些基础灵兽
      const defaultBeasts = [
        {
          beastId: 'beast_001',
          name: '小火狐',
          description: '一只能喷火的可爱狐狸，性格活泼好动。',
          type: '火灵',
          rarity: '普通',
          baseAttributes: {
            attack: 12,
            defense: 8,
            speed: 15,
            health: 80,
            mana: 60
          },
          skills: [
            {
              name: '火花',
              description: '喷出一小簇火花攻击敌人',
              damage: 10,
              cooldown: 1,
              manaCost: 5,
              targeting: 'single'
            }
          ],
          evolutionPaths: [
            {
              stage: 1,
              name: '火灵狐',
              description: '进化后的火狐，全身燃烧着微弱的火焰',
              requiredLevel: 10,
              requiredItems: [
                { itemId: 'item_001', quantity: 2 }
              ],
              statBoosts: {
                attack: 5,
                health: 20,
                mana: 15
              },
              newSkills: ['火焰漩涡']
            }
          ],
          captureRate: 0.3,
          habitat: '山林'
        },
        {
          beastId: 'beast_002',
          name: '水灵蛇',
          description: '生活在水域的灵蛇，能操控周围的水流。',
          type: '水灵',
          rarity: '稀有',
          baseAttributes: {
            attack: 10,
            defense: 12,
            speed: 13,
            health: 85,
            mana: 70
          },
          skills: [
            {
              name: '水箭',
              description: '射出高压水箭',
              damage: 12,
              cooldown: 1,
              manaCost: 5,
              targeting: 'single'
            }
          ],
          captureRate: 0.2,
          habitat: '水域'
        }
      ];
      
      await Beast.insertMany(defaultBeasts);
      console.log('Beast 数据初始化完成');
    }
  } catch (err) {
    console.error('Beast 数据初始化失败:', err);
  }
};

// 获取所有灵兽信息
const getAllBeasts = async (req, res) => {
  try {
    const beasts = await Beast.find({});
    res.status(200).json({
      success: true,
      data: beasts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取灵兽数据失败',
      error: err.message
    });
  }
};

// 获取单个灵兽信息
const getBeastById = async (req, res) => {
  try {
    const beast = await Beast.findOne({ beastId: req.params.beastId });
    if (!beast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    res.status(200).json({
      success: true,
      data: beast
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取灵兽数据失败',
      error: err.message
    });
  }
};

// 获取玩家所有灵兽
const getPlayerBeasts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const playerBeasts = await PlayerBeast.find({ userId })
      .populate({
        path: 'beastId',
        model: 'Beast'
      });
    
    res.status(200).json({
      success: true,
      count: playerBeasts.length,
      data: playerBeasts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取玩家灵兽失败',
      error: err.message
    });
  }
};

// 获取玩家特定灵兽
const getPlayerBeastById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId } = req.params;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    }).populate({
      path: 'beastId',
      model: 'Beast'
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    res.status(200).json({
      success: true,
      data: playerBeast
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取灵兽数据失败',
      error: err.message
    });
  }
};

// 捕获灵兽（简化版）
const captureBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { beastId, location } = req.body;
    
    // 获取灵兽数据
    const beast = await Beast.findOne({ beastId });
    if (!beast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    // 创建新的玩家灵兽记录
    const newPlayerBeast = new PlayerBeast({
      userId,
      beastId: beast.beastId,
      nickname: beast.name,
      level: 1,
      attributes: {
        attack: beast.baseAttributes.attack,
        defense: beast.baseAttributes.defense,
        speed: beast.baseAttributes.speed,
        health: beast.baseAttributes.health,
        mana: beast.baseAttributes.mana,
        loyalty: 50
      },
      capturedAt: new Date()
    });
    
    await newPlayerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `成功捕获 ${beast.name}`,
      data: newPlayerBeast,
      expGained: 10
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '捕获灵兽失败',
      error: err.message
    });
  }
};

// 训练灵兽（简化版）
const trainBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId, trainingType } = req.body;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    // 简化版训练逻辑
    playerBeast.attributes.attack += 1;
    playerBeast.experience += 10;
    playerBeast.lastTrained = new Date();
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `成功训练了 ${playerBeast.nickname}`,
      data: {
        level: playerBeast.level,
        experience: playerBeast.experience,
        attributes: playerBeast.attributes
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '训练灵兽失败',
      error: err.message
    });
  }
};

// 喂养灵兽（简化版）
const feedBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId } = req.body;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    // 简化版喂养逻辑
    playerBeast.attributes.loyalty = Math.min(playerBeast.attributes.loyalty + 5, 100);
    playerBeast.lastFed = new Date();
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `成功喂养了 ${playerBeast.nickname}`,
      data: {
        loyalty: playerBeast.attributes.loyalty
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '喂养灵兽失败',
      error: err.message
    });
  }
};

// 灵兽进化（简化版）
const evolveBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId } = req.body;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    // 简化版进化逻辑
    playerBeast.currentEvolution += 1;
    playerBeast.nickname = '进化' + playerBeast.nickname;
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `${playerBeast.nickname} 进化成功！`,
      data: {
        currentEvolution: playerBeast.currentEvolution
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '灵兽进化失败',
      error: err.message
    });
  }
};

// 给灵兽命名
const renameBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId, newName } = req.body;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    const oldName = playerBeast.nickname;
    playerBeast.nickname = newName;
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `成功将灵兽 ${oldName} 重命名为 ${newName}`,
      data: {
        id: playerBeast._id,
        newName
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '重命名灵兽失败',
      error: err.message
    });
  }
};

// 放生灵兽
const releaseBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId } = req.params;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    const beastName = playerBeast.nickname;
    await PlayerBeast.deleteOne({ _id: playerBeastId });
    
    res.status(200).json({
      success: true,
      message: `成功放生了 ${beastName}`,
      data: {
        id: playerBeastId,
        name: beastName
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '放生灵兽失败',
      error: err.message
    });
  }
};

// 部署灵兽（简化版）
const deployBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId, position } = req.body;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    playerBeast.isDeployed = true;
    playerBeast.deployPosition = position;
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `成功将 ${playerBeast.nickname} 部署到位置 ${position}`,
      data: {
        beast: playerBeast,
        position
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '部署灵兽失败',
      error: err.message
    });
  }
};

// 取消部署灵兽
const undeployBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId } = req.params;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    playerBeast.isDeployed = false;
    playerBeast.deployPosition = null;
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `成功取消了 ${playerBeast.nickname} 的部署`,
      data: {
        beast: playerBeast
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '取消部署灵兽失败',
      error: err.message
    });
  }
};

// 获取部署的灵兽
const getDeployedBeasts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const deployedBeasts = await PlayerBeast.find({
      userId,
      isDeployed: true
    }).populate({
      path: 'beastId',
      model: 'Beast'
    });
    
    res.status(200).json({
      success: true,
      count: deployedBeasts.length,
      data: deployedBeasts
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取部署灵兽失败',
      error: err.message
    });
  }
};

// 获取推荐灵兽 - 基于玩家当前等级和属性推荐合适的灵兽
const getRecommendedBeasts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 获取玩家角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({
        success: false,
        message: '未找到角色信息'
      });
    }
    
    // 基于角色境界推荐合适的灵兽
    const playerRealm = character.realm;
    const beasts = await Beast.find({ realmRequired: { $lte: playerRealm } });
    
    // 计算匹配分数 - 根据玩家属性和灵兽类型
    const recommendedBeasts = beasts.map(beast => {
      // 简单的匹配算法
      let matchScore = 0;
      
      // 基于属性匹配度
      if (character.attributes.strength > character.attributes.intelligence) {
        // 力量型玩家适合攻击型灵兽
        matchScore += beast.baseAttributes.attack / 10;
      } else {
        // 智力型玩家适合法术型灵兽
        matchScore += beast.baseAttributes.mana / 10;
      }
      
      // 基于灵兽稀有度
      switch (beast.rarity) {
        case '普通': matchScore += 1; break;
        case '稀有': matchScore += 2; break;
        case '珍贵': matchScore += 3; break;
        case '传说': matchScore += 4; break;
        case '神话': matchScore += 5; break;
      }
      
      return {
        beast,
        matchScore: Math.round(matchScore * 10) / 10
      };
    });
    
    // 排序并返回前5个推荐
    recommendedBeasts.sort((a, b) => b.matchScore - a.matchScore);
    const topRecommendations = recommendedBeasts.slice(0, 5);
    
    res.status(200).json({
      success: true,
      data: topRecommendations
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取推荐灵兽失败',
      error: err.message
    });
  }
};

// 灵兽配对 - 将两只灵兽配对，产生特殊效果或新的灵兽
const pairBeasts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstBeastId, secondBeastId } = req.body;
    
    // 检查两只灵兽是否都属于该玩家
    const firstBeast = await PlayerBeast.findOne({
      _id: firstBeastId,
      userId
    }).populate('beastId');
    
    const secondBeast = await PlayerBeast.findOne({
      _id: secondBeastId,
      userId
    }).populate('beastId');
    
    if (!firstBeast || !secondBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到指定的灵兽'
      });
    }
    
    // 检查两只灵兽的等级是否足够高
    const minLevelRequired = 10;
    if (firstBeast.level < minLevelRequired || secondBeast.level < minLevelRequired) {
      return res.status(400).json({
        success: false,
        message: `灵兽配对需要双方等级至少达到 ${minLevelRequired}`,
        currentLevels: {
          firstBeast: firstBeast.level,
          secondBeast: secondBeast.level
        }
      });
    }
    
    // 检查两只灵兽是否有配对兼容性（例如，某些属性组合）
    const firstType = firstBeast.beastId.type;
    const secondType = secondBeast.beastId.type;
    
    // 定义兼容的类型对
    const compatibleTypes = {
      '火灵': ['木灵', '风灵'],
      '水灵': ['火灵', '雷灵'],
      '木灵': ['土灵', '水灵'],
      '土灵': ['雷灵', '金灵'],
      '金灵': ['木灵', '火灵'],
      '风灵': ['雷灵', '水灵'],
      '雷灵': ['风灵', '火灵'],
      '光灵': ['暗灵'],
      '暗灵': ['光灵'],
      '神兽': ['神兽', '光灵', '暗灵']
    };
    
    const isCompatible = compatibleTypes[firstType] && 
                         compatibleTypes[firstType].includes(secondType);
    
    if (!isCompatible) {
      return res.status(400).json({
        success: false,
        message: '这两种灵兽属性不兼容，无法配对',
        types: {
          firstBeast: firstType,
          secondBeast: secondType
        }
      });
    }
    
    // 计算配对结果
    const pairingResult = {
      success: true,
      effect: '属性提升',
      statBoosts: {
        attack: Math.floor(Math.random() * 5) + 1,
        defense: Math.floor(Math.random() * 5) + 1,
        speed: Math.floor(Math.random() * 5) + 1
      }
    };
    
    // 稀有度高的组合有机会产生特殊效果
    if ((firstBeast.beastId.rarity === '珍贵' || firstBeast.beastId.rarity === '传说') &&
        (secondBeast.beastId.rarity === '珍贵' || secondBeast.beastId.rarity === '传说')) {
      
      // 10%的机会产生新技能
      if (Math.random() < 0.1) {
        pairingResult.effect = '新技能获得';
        pairingResult.newSkill = {
          name: `${firstType}${secondType}合击`,
          description: `结合${firstType}和${secondType}的力量进行强力攻击`,
          damage: 30 + Math.floor(Math.random() * 20)
        };
        
        // 为两只灵兽添加新技能
        firstBeast.skills.push({
          name: pairingResult.newSkill.name,
          level: 1,
          experience: 0
        });
        
        secondBeast.skills.push({
          name: pairingResult.newSkill.name,
          level: 1,
          experience: 0
        });
      }
    }
    
    // 应用属性提升效果
    firstBeast.attributes.attack += pairingResult.statBoosts.attack;
    firstBeast.attributes.defense += pairingResult.statBoosts.defense;
    firstBeast.attributes.speed += pairingResult.statBoosts.speed;
    
    secondBeast.attributes.attack += pairingResult.statBoosts.attack;
    secondBeast.attributes.defense += pairingResult.statBoosts.defense;
    secondBeast.attributes.speed += pairingResult.statBoosts.speed;
    
    // 保存更改
    await firstBeast.save();
    await secondBeast.save();
    
    // 记录配对冷却时间（24小时）
    const pairingCooldown = new Date();
    pairingCooldown.setHours(pairingCooldown.getHours() + 24);
    
    res.status(200).json({
      success: true,
      message: '灵兽配对成功',
      result: pairingResult,
      nextPairingTime: pairingCooldown,
      updatedBeasts: {
        first: firstBeast,
        second: secondBeast
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '灵兽配对失败',
      error: err.message
    });
  }
};

// 灵兽探险 - 派遣灵兽去执行任务，获取资源和经验
const sendBeastOnExpedition = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId, expeditionType, duration } = req.body;
    
    // 查找玩家灵兽
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    }).populate('beastId');
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    // 检查灵兽是否被部署或已经在执行任务
    if (playerBeast.isDeployed) {
      return res.status(400).json({
        success: false,
        message: '该灵兽已被部署，无法派遣去探险'
      });
    }
    
    // 检查灵兽忠诚度 - 低忠诚度的灵兽可能拒绝任务
    if (playerBeast.attributes.loyalty < 60) {
      return res.status(400).json({
        success: false,
        message: '灵兽忠诚度不足，拒绝执行探险任务',
        requiredLoyalty: 60,
        currentLoyalty: playerBeast.attributes.loyalty
      });
    }
    
    // 验证探险类型
    const validExpeditionTypes = ['resource', 'experience', 'treasure', 'special'];
    if (!validExpeditionTypes.includes(expeditionType)) {
      return res.status(400).json({
        success: false,
        message: '无效的探险类型',
        validTypes: validExpeditionTypes
      });
    }
    
    // 验证探险时长
    const validDurations = [1, 3, 6, 12, 24]; // 小时
    if (!validDurations.includes(Number(duration))) {
      return res.status(400).json({
        success: false,
        message: '无效的探险时长',
        validDurations
      });
    }
    
    // 计算任务完成时间
    const expeditionEndTime = new Date();
    expeditionEndTime.setHours(expeditionEndTime.getHours() + Number(duration));
    
    // 计算成功率 - 基于灵兽等级、属性和任务难度
    let successRate = 0.5; // 基础成功率
    
    // 等级影响
    successRate += playerBeast.level * 0.02; // 每级增加2%成功率
    
    // 属性影响
    const totalAttributes = 
      playerBeast.attributes.attack + 
      playerBeast.attributes.defense + 
      playerBeast.attributes.speed;
    successRate += (totalAttributes / 100) * 0.1; // 属性总和每100点增加10%成功率
    
    // 时长影响 - 时间越长成功率越低
    successRate -= (Number(duration) / 24) * 0.1; // 每天降低10%成功率
    
    // 确保成功率在合理范围内
    successRate = Math.min(Math.max(successRate, 0.1), 0.95);
    
    // 记录探险信息
    const expedition = {
      type: expeditionType,
      startTime: new Date(),
      endTime: expeditionEndTime,
      duration: Number(duration),
      status: 'ongoing',
      successRate: successRate
    };
    
    // 更新灵兽状态 - 标记为正在探险
    playerBeast.isDeployed = true; // 复用字段表示灵兽不可用
    playerBeast.expedition = expedition;
    
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `成功派遣 ${playerBeast.nickname} 去执行${duration}小时的${getExpeditionTypeName(expeditionType)}探险`,
      data: {
        beast: playerBeast,
        expedition: expedition,
        estimatedRewards: calculateEstimatedRewards(expeditionType, Number(duration), playerBeast)
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '派遣灵兽探险失败',
      error: err.message
    });
  }
};

// 完成灵兽探险 - 结算奖励
const completeExpedition = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId } = req.params;
    
    // 查找玩家灵兽
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId,
      isDeployed: true, // 确保灵兽确实在执行任务
      'expedition.status': 'ongoing'
    });
    
    if (!playerBeast) {
      return res.status(404).json({
        success: false,
        message: '未找到正在执行探险任务的灵兽'
      });
    }
    
    // 检查任务是否已完成
    const now = new Date();
    const expedition = playerBeast.expedition;
    
    if (now < new Date(expedition.endTime)) {
      const remainingTime = Math.ceil((new Date(expedition.endTime) - now) / (1000 * 60)); // 剩余分钟
      return res.status(400).json({
        success: false,
        message: `探险任务尚未完成，还需等待 ${remainingTime} 分钟`,
        endTime: expedition.endTime,
        remainingMinutes: remainingTime
      });
    }
    
    // 确定任务是否成功 - 基于成功率
    const isSuccess = Math.random() < expedition.successRate;
    
    // 计算奖励
    let rewards = {};
    if (isSuccess) {
      rewards = calculateRewards(expedition.type, expedition.duration, playerBeast);
      
      // 获取角色信息更新资源
      const character = await Character.findOne({ userId });
      if (character) {
        character.resources.gold += rewards.gold || 0;
        character.resources.spiritStones += rewards.spiritStones || 0;
        character.experience += rewards.experience || 0;
        await character.save();
      }
      
      // 更新灵兽经验
      playerBeast.experience += rewards.beastExperience || 0;
      
      // 检查灵兽升级
      const expNeededForNextLevel = playerBeast.level * 100;
      if (playerBeast.experience >= expNeededForNextLevel) {
        playerBeast.level += 1;
        playerBeast.experience -= expNeededForNextLevel;
        
        // 升级属性提升
        playerBeast.attributes.attack += 2;
        playerBeast.attributes.defense += 2;
        playerBeast.attributes.speed += 2;
        playerBeast.attributes.health += 10;
        playerBeast.attributes.mana += 5;
        
        rewards.levelUp = true;
      }
    }
    
    // 更新灵兽状态
    playerBeast.isDeployed = false;
    playerBeast.expedition = {
      ...expedition,
      status: isSuccess ? 'completed' : 'failed',
      completedAt: now,
      rewards: isSuccess ? rewards : null
    };
    
    // 探险无论成功失败都降低一点忠诚度
    playerBeast.attributes.loyalty = Math.max(playerBeast.attributes.loyalty - 1, 0);
    
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: isSuccess 
        ? `${playerBeast.nickname} 成功完成了探险任务！` 
        : `${playerBeast.nickname} 的探险任务失败了`,
      data: {
        beast: playerBeast,
        expedition: playerBeast.expedition,
        isSuccess: isSuccess,
        rewards: isSuccess ? rewards : null
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '完成灵兽探险失败',
      error: err.message
    });
  }
};

// 工具函数 - 获取探险类型名称
function getExpeditionTypeName(type) {
  const typeNames = {
    'resource': '资源',
    'experience': '经验',
    'treasure': '宝藏',
    'special': '特殊'
  };
  return typeNames[type] || type;
}

// 工具函数 - 计算预估奖励
function calculateEstimatedRewards(type, duration, beast) {
  const baseMultiplier = duration / 3; // 时长因子
  const levelMultiplier = (beast.level / 10) + 0.5; // 等级因子
  
  let rewards = {
    gold: 0,
    spiritStones: 0,
    experience: 0,
    beastExperience: 0,
    items: []
  };
  
  switch (type) {
    case 'resource':
      rewards.gold = Math.floor(50 * baseMultiplier * levelMultiplier);
      rewards.spiritStones = Math.floor(10 * baseMultiplier * levelMultiplier);
      break;
    case 'experience':
      rewards.experience = Math.floor(100 * baseMultiplier * levelMultiplier);
      rewards.beastExperience = Math.floor(50 * baseMultiplier * levelMultiplier);
      break;
    case 'treasure':
      rewards.gold = Math.floor(100 * baseMultiplier * levelMultiplier);
      rewards.spiritStones = Math.floor(30 * baseMultiplier * levelMultiplier);
      rewards.items = ['可能获得稀有物品'];
      break;
    case 'special':
      rewards.gold = Math.floor(30 * baseMultiplier * levelMultiplier);
      rewards.spiritStones = Math.floor(20 * baseMultiplier * levelMultiplier);
      rewards.experience = Math.floor(50 * baseMultiplier * levelMultiplier);
      rewards.beastExperience = Math.floor(80 * baseMultiplier * levelMultiplier);
      rewards.items = ['可能获得特殊物品'];
      break;
  }
  
  return rewards;
}

// 工具函数 - 计算实际奖励（加入随机因素）
function calculateRewards(type, duration, beast) {
  const estimatedRewards = calculateEstimatedRewards(type, duration, beast);
  
  // 添加随机浮动 (±20%)
  const randomFactor = 0.8 + (Math.random() * 0.4);
  
  const actualRewards = {
    gold: Math.floor(estimatedRewards.gold * randomFactor),
    spiritStones: Math.floor(estimatedRewards.spiritStones * randomFactor),
    experience: Math.floor(estimatedRewards.experience * randomFactor),
    beastExperience: Math.floor(estimatedRewards.beastExperience * randomFactor),
    items: []
  };
  
  // 特殊物品掉落几率
  if (type === 'treasure' || type === 'special') {
    const itemDropChance = type === 'treasure' ? 0.3 : 0.15;
    
    if (Math.random() < itemDropChance) {
      // 物品池示例
      const itemPools = {
        'treasure': ['灵石袋', '灵兽口粮', '灵兽装备图纸'],
        'special': ['进化石', '技能卷轴', '属性强化丹']
      };
      
      // 随机选择一件物品
      const poolItems = itemPools[type];
      const randomItem = poolItems[Math.floor(Math.random() * poolItems.length)];
      actualRewards.items.push(randomItem);
    }
  }
  
  return actualRewards;
}

// 导出所有方法
module.exports = {
  getAllBeasts,
  getBeastById,
  getPlayerBeasts,
  getPlayerBeastById,
  captureBeast,
  trainBeast,
  feedBeast,
  evolveBeast,
  renameBeast,
  releaseBeast,
  deployBeast,
  undeployBeast,
  getDeployedBeasts,
  getRecommendedBeasts,
  pairBeasts,
  sendBeastOnExpedition,
  completeExpedition,
  initializeBeasts
}; 