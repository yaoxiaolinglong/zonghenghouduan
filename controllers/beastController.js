/**
 * 灵兽系统控制器
 * Beast System Controller
 * 
 * 处理灵兽相关的所有业务逻辑
 * Handles all business logic related to the beast system
 */

const Beast = require('../models/Beast');
const PlayerBeast = require('../models/PlayerBeast');
const Character = require('../models/Character');
const mongoose = require('mongoose');
const { authenticateToken } = require('../middleware/auth');

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
            },
            {
              name: '火球术',
              description: '凝聚一个火球投向敌人',
              damage: 25,
              cooldown: 3,
              unlockLevel: 5,
              manaCost: 15,
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
                { itemId: 'item_001', quantity: 2 }, // 火灵石
                { itemId: 'item_002', quantity: 1 }  // 兽魂珠
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
            },
            {
              name: '水盾',
              description: '在身体周围形成水盾，提高防御',
              buffEffect: { defense: 10 },
              cooldown: 4,
              unlockLevel: 4,
              manaCost: 15,
              targeting: 'self'
            }
          ],
          captureRate: 0.2,
          habitat: '水域'
        },
        {
          beastId: 'beast_003',
          name: '雷鹰',
          description: '体内蕴含雷电之力的猛禽，速度极快。',
          type: '雷灵',
          rarity: '珍贵',
          baseAttributes: {
            attack: 15,
            defense: 8,
            speed: 18,
            health: 75,
            mana: 65
          },
          skills: [
            {
              name: '电击',
              description: '释放体内雷电攻击敌人',
              damage: 15,
              cooldown: 1,
              manaCost: 5,
              targeting: 'single'
            },
            {
              name: '雷暴',
              description: '召唤雷暴攻击所有敌人',
              damage: 20,
              cooldown: 5,
              unlockLevel: 8,
              manaCost: 25,
              targeting: 'all'
            }
          ],
          captureRate: 0.15,
          habitat: '天空'
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
exports.getAllBeasts = async (req, res) => {
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
exports.getBeastById = async (req, res) => {
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
exports.getPlayerBeasts = async (req, res) => {
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
exports.getPlayerBeastById = async (req, res) => {
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

// 捕获灵兽
exports.captureBeast = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const userId = req.user.id;
    const { beastId, location } = req.body;
    
    // 获取灵兽数据
    const beast = await Beast.findOne({ beastId });
    if (!beast) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    // 获取玩家角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: '未找到角色信息'
      });
    }
    
    // 检查玩家等级是否满足捕获条件
    const playerRealm = character.realm;
    if (playerRealm < beast.realmRequired) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `修为不足，无法捕获此灵兽，需要 ${beast.realmRequired} 境界`
      });
    }
    
    // 计算捕获几率
    const baseRate = beast.captureRate;
    const realmBonus = 0.05 * (character.realmLevel - 1);
    const locationBonus = location === beast.habitat ? 0.1 : 0;
    const finalRate = Math.min(baseRate + realmBonus + locationBonus, 0.9);
    
    // 随机决定是否成功捕获
    const roll = Math.random();
    if (roll > finalRate) {
      await session.abortTransaction();
      session.endSession();
      return res.status(200).json({
        success: false,
        message: '捕获失败，灵兽逃脱了',
        captureRate: finalRate,
        roll: roll
      });
    }
    
    // 检查是否已经拥有此灵兽
    const existingBeast = await PlayerBeast.findOne({ 
      userId, 
      beastId: beast.beastId 
    });
    
    if (existingBeast) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: '你已经拥有此灵兽'
      });
    }
    
    // 创建新的玩家灵兽记录
    const newPlayerBeast = new PlayerBeast({
      userId,
      beastId: beast.beastId,
      nickname: beast.name,
      level: 1,
      experience: 0,
      attributes: {
        attack: beast.baseAttributes.attack,
        defense: beast.baseAttributes.defense,
        speed: beast.baseAttributes.speed,
        health: beast.baseAttributes.health,
        mana: beast.baseAttributes.mana,
        loyalty: 50
      },
      skills: beast.skills
        .filter(skill => skill.unlockLevel <= 1)
        .map(skill => ({
          name: skill.name,
          level: 1,
          experience: 0
        })),
      capturedAt: new Date()
    });
    
    await newPlayerBeast.save({ session });
    
    // 增加角色经验
    const expGain = beast.rarity === '普通' ? 10 : 
                   beast.rarity === '稀有' ? 20 : 
                   beast.rarity === '珍贵' ? 30 : 
                   beast.rarity === '传说' ? 50 : 100;
    
    character.experience += expGain;
    await character.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: `成功捕获 ${beast.name}`,
      data: newPlayerBeast,
      expGained: expGain
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({
      success: false,
      message: '捕获灵兽失败',
      error: err.message
    });
  }
};

// 训练灵兽
exports.trainBeast = async (req, res) => {
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
    
    // 检查上次训练时间
    const now = new Date();
    if (playerBeast.lastTrained) {
      const hoursSinceLastTraining = (now - playerBeast.lastTrained) / (1000 * 60 * 60);
      if (hoursSinceLastTraining < 1) {
        return res.status(400).json({
          success: false,
          message: '灵兽需要休息，1小时内只能训练一次',
          nextTrainingTime: new Date(playerBeast.lastTrained.getTime() + 60 * 60 * 1000)
        });
      }
    }
    
    // 根据训练类型提升不同属性
    let expGain = 10;
    const statGain = 1 + Math.floor(playerBeast.level / 5);
    
    switch (trainingType) {
      case 'attack':
        playerBeast.attributes.attack += statGain;
        break;
      case 'defense':
        playerBeast.attributes.defense += statGain;
        break;
      case 'speed':
        playerBeast.attributes.speed += statGain;
        break;
      case 'health':
        playerBeast.attributes.health += statGain * 5;
        break;
      case 'mana':
        playerBeast.attributes.mana += statGain * 2;
        break;
      case 'loyalty':
        playerBeast.attributes.loyalty = Math.min(playerBeast.attributes.loyalty + 5, 100);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: '无效的训练类型'
        });
    }
    
    // 增加经验并检查升级
    playerBeast.experience += expGain;
    const expNeededForNextLevel = playerBeast.level * 100;
    
    if (playerBeast.experience >= expNeededForNextLevel) {
      playerBeast.level += 1;
      playerBeast.experience -= expNeededForNextLevel;
      
      // 升级时提升所有属性
      playerBeast.attributes.attack += 2;
      playerBeast.attributes.defense += 2;
      playerBeast.attributes.speed += 2;
      playerBeast.attributes.health += 10;
      playerBeast.attributes.mana += 5;
    }
    
    playerBeast.lastTrained = now;
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message: `成功训练了 ${playerBeast.nickname}`,
      data: {
        level: playerBeast.level,
        experience: playerBeast.experience,
        expNeededForNextLevel,
        attributes: playerBeast.attributes,
        trainingType,
        statGain
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

// 喂养灵兽
exports.feedBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId, food } = req.body;
    
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
    
    // 基础喂养效果
    let loyaltyGain = 3;
    let expGain = 5;
    let message = `成功喂养了 ${playerBeast.nickname}`;
    
    // 根据食物类型提供不同效果
    if (food) {
      switch (food) {
        case 'premium_food':
          loyaltyGain = 10;
          expGain = 15;
          message = `使用高级食物喂养了 ${playerBeast.nickname}，它看起来很高兴！`;
          break;
        case 'type_specific_food':
          loyaltyGain = 7;
          expGain = 10;
          message = `使用属性食物喂养了 ${playerBeast.nickname}，效果不错！`;
          break;
        default:
          // 使用基础效果
      }
    }
    
    // 更新灵兽数据
    playerBeast.attributes.loyalty = Math.min(playerBeast.attributes.loyalty + loyaltyGain, 100);
    playerBeast.experience += expGain;
    playerBeast.lastFed = new Date();
    
    // 根据心情调整效果
    if (playerBeast.mood === 'happy') {
      expGain += 3;
      message += ' 它现在看起来特别高兴！';
    } else if (playerBeast.mood === 'unhappy') {
      expGain -= 2;
      loyaltyGain -= 1;
      message += ' 它的心情似乎有所好转。';
      playerBeast.mood = 'normal';
    }
    
    // 检查是否升级
    const expNeededForNextLevel = playerBeast.level * 100;
    if (playerBeast.experience >= expNeededForNextLevel) {
      playerBeast.level += 1;
      playerBeast.experience -= expNeededForNextLevel;
      message += ` ${playerBeast.nickname} 升级了！`;
    }
    
    await playerBeast.save();
    
    res.status(200).json({
      success: true,
      message,
      data: {
        level: playerBeast.level,
        experience: playerBeast.experience,
        expGained: expGain,
        loyaltyGained: loyaltyGain,
        loyalty: playerBeast.attributes.loyalty,
        mood: playerBeast.mood
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

// 灵兽进化
exports.evolveBeast = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const userId = req.user.id;
    const { playerBeastId } = req.body;
    
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    }).populate({
      path: 'beastId',
      model: 'Beast'
    });
    
    if (!playerBeast) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    const beastTemplate = await Beast.findOne({ beastId: playerBeast.beastId });
    
    // 检查是否有下一阶段进化
    const nextEvolution = beastTemplate.evolutionPaths.find(
      path => path.stage === playerBeast.currentEvolution + 1
    );
    
    if (!nextEvolution) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: '此灵兽无法再进化'
      });
    }
    
    // 检查等级要求
    if (playerBeast.level < nextEvolution.requiredLevel) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `等级不足，需要达到 ${nextEvolution.requiredLevel} 级才能进化`,
        currentLevel: playerBeast.level,
        requiredLevel: nextEvolution.requiredLevel
      });
    }
    
    // 检查忠诚度
    if (playerBeast.attributes.loyalty < 80) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: '忠诚度不足，需要达到80以上才能进化',
        currentLoyalty: playerBeast.attributes.loyalty,
        requiredLoyalty: 80
      });
    }
    
    // 检查材料需求（简化版，实际实现需要检查玩家背包）
    // TODO: 实现材料消耗逻辑
    
    // 应用进化效果
    playerBeast.currentEvolution += 1;
    playerBeast.nickname = nextEvolution.name; // 更新为进化后的名称
    
    // 提升属性
    const { statBoosts } = nextEvolution;
    playerBeast.attributes.attack += statBoosts.attack || 0;
    playerBeast.attributes.defense += statBoosts.defense || 0;
    playerBeast.attributes.speed += statBoosts.speed || 0;
    playerBeast.attributes.health += statBoosts.health || 0;
    playerBeast.attributes.mana += statBoosts.mana || 0;
    
    // 解锁新技能
    if (nextEvolution.newSkills && nextEvolution.newSkills.length > 0) {
      // 查找原始灵兽模板中的技能
      const beastSkills = beastTemplate.skills;
      
      for (const skillName of nextEvolution.newSkills) {
        const skillTemplate = beastSkills.find(s => s.name === skillName);
        
        if (skillTemplate) {
          const existingSkill = playerBeast.skills.find(s => s.name === skillName);
          
          if (!existingSkill) {
            playerBeast.skills.push({
              name: skillName,
              level: 1,
              experience: 0
            });
          }
        }
      }
    }
    
    await playerBeast.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: `${playerBeast.nickname} 进化成功！`,
      data: {
        newForm: nextEvolution.name,
        currentEvolution: playerBeast.currentEvolution,
        attributes: playerBeast.attributes,
        skills: playerBeast.skills
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({
      success: false,
      message: '灵兽进化失败',
      error: err.message
    });
  }
};

// 给灵兽命名
exports.renameBeast = async (req, res) => {
  try {
    const userId = req.user.id;
    const { playerBeastId, newName } = req.body;
    
    if (!newName || newName.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '名称不能为空'
      });
    }
    
    if (newName.length > 20) {
      return res.status(400).json({
        success: false,
        message: '名称不能超过20个字符'
      });
    }
    
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
exports.releaseBeast = async (req, res) => {
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
    
    // 检查是否已部署（出战中）
    if (playerBeast.isDeployed) {
      return res.status(400).json({
        success: false,
        message: '无法放生已部署的灵兽，请先取消部署'
      });
    }
    
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

// 部署灵兽（出战）
exports.deployBeast = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const userId = req.user.id;
    const { playerBeastId, position } = req.body;
    
    if (!position || position < 1 || position > 6) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: '无效的部署位置，必须为1-6'
      });
    }
    
    // 检查该位置是否已有灵兽
    const existingBeast = await PlayerBeast.findOne({
      userId,
      isDeployed: true,
      deployPosition: position
    });
    
    // 如果有灵兽，取消其部署
    if (existingBeast) {
      existingBeast.isDeployed = false;
      existingBeast.deployPosition = null;
      await existingBeast.save({ session });
    }
    
    // 部署新灵兽
    const playerBeast = await PlayerBeast.findOne({
      _id: playerBeastId,
      userId
    });
    
    if (!playerBeast) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: '未找到该灵兽'
      });
    }
    
    // 检查忠诚度
    if (playerBeast.attributes.loyalty < 30) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: '忠诚度过低，灵兽拒绝出战'
      });
    }
    
    playerBeast.isDeployed = true;
    playerBeast.deployPosition = position;
    await playerBeast.save({ session });
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      success: true,
      message: `成功将 ${playerBeast.nickname} 部署到位置 ${position}`,
      data: {
        beast: playerBeast,
        position
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    
    res.status(500).json({
      success: false,
      message: '部署灵兽失败',
      error: err.message
    });
  }
};

// 取消部署灵兽
exports.undeployBeast = async (req, res) => {
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
    
    if (!playerBeast.isDeployed) {
      return res.status(400).json({
        success: false,
        message: '此灵兽未部署'
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
exports.getDeployedBeasts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const deployedBeasts = await PlayerBeast.find({
      userId,
      isDeployed: true
    }).populate({
      path: 'beastId',
      model: 'Beast'
    }).sort('deployPosition');
    
    // 创建一个数组表示6个位置
    const deploymentPositions = Array(6).fill(null);
    
    // 将灵兽放入对应位置
    for (const beast of deployedBeasts) {
      if (beast.deployPosition && beast.deployPosition >= 1 && beast.deployPosition <= 6) {
        deploymentPositions[beast.deployPosition - 1] = beast;
      }
    }
    
    res.status(200).json({
      success: true,
      count: deployedBeasts.length,
      data: {
        deployedBeasts,
        deploymentPositions
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: '获取部署灵兽失败',
      error: err.message
    });
  }
};

// 初始化灵兽数据
exports.initializeBeasts = initializeBeasts; 