/**
 * 宗门系统控制器
 * Sect System Controller
 * 
 * 处理与宗门相关的所有业务逻辑
 * Handles all business logic related to the sect system
 */

const { Sect, SectApplication } = require('../models/Sect');
const User = require('../models/User');
const Character = require('../models/Character');
const { generateId } = require('../utils/idGenerator');

/**
 * 初始化默认宗门数据
 * Initialize default sect data
 */
const initializeSects = async () => {
  try {
    // 检查是否已经有宗门数据
    const sectCount = await Sect.countDocuments();
    
    if (sectCount === 0) {
      console.log('初始化宗门数据...');
      
      // 创建几个默认宗门
      const defaultSects = [
        {
          sectId: 'SECT' + generateId(),
          name: '青云门',
          description: '位于青云山脉的正道宗门，以剑法和清灵仙法闻名于修真界。',
          level: 5,
          founderUserId: 'admin',
          resources: {
            spiritStones: 5000,
            contributionPoints: 10000,
            materials: [
              { type: '灵石', amount: 3000 },
              { type: '灵木', amount: 1000 },
              { type: '灵药', amount: 1500 }
            ]
          },
          territory: {
            size: 5,
            environment: 'mountain',
            resourceRichness: 7,
            dangerLevel: 4
          },
          reputation: 2000,
          positions: [
            {
              id: 'POS' + generateId(),
              name: '掌门',
              level: 5,
              privileges: {
                canRecruit: true,
                canExpel: true,
                canManageResources: true,
                canAssignTasks: true,
                canManageFacilities: true,
                canDistributeBenefits: true
              },
              dailyContribution: 0,
              description: '宗门最高领导者，全权负责宗门事务'
            },
            {
              id: 'POS' + generateId(),
              name: '长老',
              level: 4,
              privileges: {
                canRecruit: true,
                canExpel: true,
                canManageResources: true,
                canAssignTasks: true,
                canManageFacilities: true,
                canDistributeBenefits: false
              },
              dailyContribution: 20,
              description: '宗门核心管理者，负责宗门日常运营'
            },
            {
              id: 'POS' + generateId(),
              name: '执事',
              level: 3,
              privileges: {
                canRecruit: true,
                canExpel: false,
                canManageResources: false,
                canAssignTasks: true,
                canManageFacilities: false,
                canDistributeBenefits: false
              },
              dailyContribution: 50,
              description: '宗门中层管理者，负责具体事务执行'
            },
            {
              id: 'POS' + generateId(),
              name: '内门弟子',
              level: 2,
              privileges: {
                canRecruit: false,
                canExpel: false,
                canManageResources: false,
                canAssignTasks: false,
                canManageFacilities: false,
                canDistributeBenefits: false
              },
              dailyContribution: 80,
              description: '宗门核心弟子，享有高级修炼资源'
            },
            {
              id: 'POS' + generateId(),
              name: '外门弟子',
              level: 1,
              privileges: {
                canRecruit: false,
                canExpel: false,
                canManageResources: false,
                canAssignTasks: false,
                canManageFacilities: false,
                canDistributeBenefits: false
              },
              dailyContribution: 100,
              description: '宗门普通成员，负责基础事务'
            }
          ],
          facilities: [
            {
              id: 'FAC' + generateId(),
              name: '聚灵阵',
              type: 'cultivation',
              level: 3,
              description: '提升修炼效率的灵阵设施',
              effects: [
                {
                  type: 'cultivationBonus',
                  value: 0.15,
                  description: '提高修炼速度15%'
                }
              ],
              attributeBonus: {
                cultivationSpeed: 0.15
              }
            },
            {
              id: 'FAC' + generateId(),
              name: '藏经阁',
              type: 'special',
              level: 3,
              description: '存放各类功法秘籍的宝库',
              effects: [
                {
                  type: 'learningBonus',
                  value: 0.10,
                  description: '提高功法学习速度10%'
                }
              ],
              attributeBonus: {
                cultivationSpeed: 0.05,
                refiningSuccess: 0.05
              }
            }
          ],
          techniques: [
            {
              id: 'TECH' + generateId(),
              name: '御剑术',
              description: '青云门镇派功法，可御剑飞行攻击',
              level: 4,
              type: 'combat',
              attributes: {
                combatPower: 30,
                elementalAffinity: 'wind'
              },
              unlocked: true,
              requirements: {
                playerLevel: 3,
                contribution: 500
              }
            },
            {
              id: 'TECH' + generateId(),
              name: '清灵心法',
              description: '提升灵力纯度的内功心法',
              level: 3,
              type: 'cultivation',
              attributes: {
                cultivationSpeed: 20
              },
              unlocked: true,
              requirements: {
                playerLevel: 1,
                contribution: 200
              }
            }
          ],
          settings: {
            autoAcceptMembers: false,
            minLevelToJoin: 2,
            inviteOnly: false,
            contributionRequirements: 0,
            inactivityThreshold: 14
          }
        },
        {
          sectId: 'SECT' + generateId(),
          name: '万毒门',
          description: '以炼制毒药和培养毒物闻名的门派，位于幽暗毒沼。',
          level: 4,
          founderUserId: 'admin',
          resources: {
            spiritStones: 3000,
            contributionPoints: 7000,
            materials: [
              { type: '毒草', amount: 3000 },
              { type: '毒液', amount: 1500 },
              { type: '灵石', amount: 1000 }
            ]
          },
          territory: {
            size: 4,
            environment: 'valley',
            resourceRichness: 6,
            dangerLevel: 7
          },
          reputation: -1000,
          positions: [
            {
              id: 'POS' + generateId(),
              name: '门主',
              level: 5,
              privileges: {
                canRecruit: true,
                canExpel: true,
                canManageResources: true,
                canAssignTasks: true,
                canManageFacilities: true,
                canDistributeBenefits: true
              },
              description: '万毒门最高统治者'
            },
            {
              id: 'POS' + generateId(),
              name: '堂主',
              level: 3,
              privileges: {
                canRecruit: true,
                canExpel: true,
                canManageResources: false,
                canAssignTasks: true,
                canManageFacilities: false,
                canDistributeBenefits: false
              },
              dailyContribution: 50,
              description: '负责管理门派中各堂口事务'
            },
            {
              id: 'POS' + generateId(),
              name: '精英弟子',
              level: 2,
              privileges: {
                canRecruit: false,
                canExpel: false,
                canManageResources: false,
                canAssignTasks: false,
                canManageFacilities: false,
                canDistributeBenefits: false
              },
              dailyContribution: 80,
              description: '有成就的门派弟子'
            },
            {
              id: 'POS' + generateId(),
              name: '普通弟子',
              level: 1,
              privileges: {
                canRecruit: false,
                canExpel: false,
                canManageResources: false,
                canAssignTasks: false,
                canManageFacilities: false,
                canDistributeBenefits: false
              },
              dailyContribution: 100,
              description: '刚入门的弟子'
            }
          ],
          facilities: [
            {
              id: 'FAC' + generateId(),
              name: '毒物培育池',
              type: 'production',
              level: 4,
              description: '培育各种毒虫毒物的特殊设施',
              effects: [
                {
                  type: 'poisonProduction',
                  value: 0.25,
                  description: '提高毒物培育效率25%'
                }
              ],
              attributeBonus: {
                resourceProduction: 0.25
              }
            }
          ],
          techniques: [
            {
              id: 'TECH' + generateId(),
              name: '万毒心经',
              description: '修炼后可百毒不侵，并可操控毒物',
              level: 4,
              type: 'cultivation',
              attributes: {
                cultivationSpeed: 15,
                elementalAffinity: 'poison'
              },
              unlocked: true,
              requirements: {
                playerLevel: 2,
                contribution: 300
              }
            }
          ],
          settings: {
            autoAcceptMembers: false,
            minLevelToJoin: 1,
            inviteOnly: true,
            contributionRequirements: 100,
            inactivityThreshold: 30
          }
        }
      ];
      
      await Sect.insertMany(defaultSects);
      console.log('宗门数据初始化完成');
    } else {
      console.log('宗门数据已存在，跳过初始化');
    }
  } catch (err) {
    console.error('宗门数据初始化失败:', err);
  }
};

/**
 * 获取所有宗门列表
 * Get all sects
 */
const getAllSects = async (req, res) => {
  try {
    const sects = await Sect.find({});
    
    // 格式化返回数据
    const formattedSects = sects.map(sect => ({
      sectId: sect.sectId,
      name: sect.name,
      description: sect.description,
      level: sect.level,
      reputation: sect.reputation,
      territory: sect.territory ? { environment: sect.territory.environment } : null,
      memberCount: sect.members ? sect.members.length : 0
    }));
    
    res.status(200).json({
      success: true,
      count: formattedSects.length,
      data: formattedSects
    });
  } catch (error) {
    console.error('获取宗门列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取宗门列表失败',
      error: error.message
    });
  }
};

/**
 * 获取宗门详情
 * Get sect details
 */
const getSectById = async (req, res) => {
  try {
    const { sectId } = req.params;
    
    const sect = await Sect.findOne({ sectId });
    if (!sect) {
      return res.status(404).json({
        success: false,
        message: '宗门不存在'
      });
    }
    
    // 排除敏感信息
    const sanitizedSect = {
      sectId: sect.sectId,
      name: sect.name,
      description: sect.description,
      level: sect.level,
      reputation: sect.reputation,
      territory: sect.territory,
      positions: sect.positions,
      memberCount: sect.members ? sect.members.length : 0,
      facilities: sect.facilities ? sect.facilities.map(f => ({
        id: f.id,
        name: f.name,
        type: f.type,
        level: f.level,
        description: f.description,
        effects: f.effects,
        attributeBonus: f.attributeBonus
      })) : [],
      techniques: sect.techniques ? sect.techniques.map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        level: t.level,
        type: t.type,
        unlocked: t.unlocked,
        requirements: t.requirements,
        attributes: t.attributes
      })) : [],
      createdAt: sect.createdAt
    };
    
    res.status(200).json({
      success: true,
      data: sanitizedSect
    });
  } catch (error) {
    console.error('获取宗门详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取宗门详情失败',
      error: error.message
    });
  }
};

/**
 * 创建新宗门
 * Create a new sect
 */
const createSect = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, territory, settings } = req.body;
    
    // 验证必须参数
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '宗门名称为必填项'
      });
    }
    
    // 检查宗门名称是否已存在
    const existingSect = await Sect.findOne({ name });
    if (existingSect) {
      return res.status(400).json({
        success: false,
        message: '该宗门名称已被使用'
      });
    }
    
    // 检查是否已经是其他宗门的成员
    const userInOtherSect = await Sect.findOne({ 'members.userId': userId });
    if (userInOtherSect) {
      return res.status(400).json({
        success: false,
        message: '您已经是另一个宗门的成员，请先退出当前宗门'
      });
    }
    
    // 检查玩家角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({
        success: false,
        message: '未找到玩家角色信息'
      });
    }
    
    // 获取玩家用户名
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '未找到用户信息'
      });
    }
    
    // 创建默认的宗门职位
    const defaultPositions = [
      {
        id: 'POS' + generateId(),
        name: '宗主',
        level: 5,
        privileges: {
          canRecruit: true,
          canExpel: true,
          canManageResources: true,
          canAssignTasks: true,
          canManageFacilities: true,
          canDistributeBenefits: true
        },
        dailyContribution: 0,
        description: '宗门创始人，拥有最高权限'
      },
      {
        id: 'POS' + generateId(),
        name: '长老',
        level: 4,
        privileges: {
          canRecruit: true,
          canExpel: true,
          canManageResources: true,
          canAssignTasks: true,
          canManageFacilities: false,
          canDistributeBenefits: false
        },
        dailyContribution: 20,
        description: '宗门高级成员，参与管理'
      },
      {
        id: 'POS' + generateId(),
        name: '内门弟子',
        level: 2,
        privileges: {
          canRecruit: false,
          canExpel: false,
          canManageResources: false,
          canAssignTasks: false,
          canManageFacilities: false,
          canDistributeBenefits: false
        },
        dailyContribution: 50,
        description: '有资历的宗门成员'
      },
      {
        id: 'POS' + generateId(),
        name: '外门弟子',
        level: 1,
        privileges: {
          canRecruit: false,
          canExpel: false,
          canManageResources: false,
          canAssignTasks: false,
          canManageFacilities: false,
          canDistributeBenefits: false
        },
        dailyContribution: 100,
        description: '初级宗门成员'
      }
    ];
    
    // 创建创始成员记录
    const founderMember = {
      userId,
      name: user.username || character.name || '未命名用户',
      joinDate: new Date(),
      position: defaultPositions[0].id, // 宗主
      totalContribution: 0,
      weeklyContribution: 0,
      lastContributionReset: new Date(),
      status: 'active'
    };
    
    // 创建新宗门
    const newSect = new Sect({
      sectId: 'SECT' + generateId(),
      name,
      description: description || `${name} - 新创建的宗门`,
      founderUserId: userId,
      positions: defaultPositions,
      members: [founderMember],
      resources: {
        spiritStones: 0,
        contributionPoints: 0,
        materials: []
      },
      territory: territory || {
        size: 1,
        environment: 'mountain',
        resourceRichness: 3,
        dangerLevel: 2
      },
      settings: settings || {
        autoAcceptMembers: false,
        minLevelToJoin: 1,
        inviteOnly: false,
        contributionRequirements: 0,
        inactivityThreshold: 30
      }
    });
    
    const savedSect = await newSect.save();
    
    res.status(201).json({
      success: true,
      message: '宗门创建成功',
      data: {
        sectId: savedSect.sectId,
        name: savedSect.name
      }
    });
  } catch (error) {
    console.error('创建宗门失败:', error);
    res.status(500).json({
      success: false,
      message: '创建宗门失败',
      error: error.message
    });
  }
};

/**
 * 申请加入宗门
 * Apply to join a sect
 */
const applyToJoinSect = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sectId, message } = req.body;
    
    // 验证必要参数
    if (!sectId) {
      return res.status(400).json({
        success: false,
        message: '宗门ID为必填项'
      });
    }
    
    // 检查宗门是否存在
    const sect = await Sect.findOne({ sectId });
    if (!sect) {
      return res.status(404).json({
        success: false,
        message: '宗门不存在'
      });
    }
    
    // 检查玩家是否已经是该宗门成员
    const isMember = sect.members.some(member => member.userId === userId);
    if (isMember) {
      return res.status(400).json({
        success: false,
        message: '您已经是该宗门的成员'
      });
    }
    
    // 检查是否已经申请过该宗门
    const existingApplication = await SectApplication.findOne({ 
      sectId, 
      userId,
      status: 'pending'
    });
    
    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: '您已经申请过该宗门，请等待审核'
      });
    }
    
    // 检查是否已经是其他宗门成员
    const userInOtherSect = await Sect.findOne({ 'members.userId': userId });
    if (userInOtherSect) {
      return res.status(400).json({
        success: false,
        message: '您已经是另一个宗门的成员，请先退出当前宗门'
      });
    }
    
    // 获取玩家信息
    const user = await User.findById(userId);
    const character = await Character.findOne({ userId });
    
    if (!user || !character) {
      return res.status(404).json({
        success: false,
        message: '无法获取玩家信息'
      });
    }
    
    // 检查是否符合宗门加入条件
    if (character.level < sect.settings.minLevelToJoin) {
      return res.status(400).json({
        success: false,
        message: `您的等级不满足该宗门的最低要求：${sect.settings.minLevelToJoin}级`
      });
    }
    
    // 检查宗门是否为邀请制
    if (sect.settings.inviteOnly) {
      return res.status(400).json({
        success: false,
        message: '该宗门为邀请制，无法直接申请加入'
      });
    }
    
    // 创建新的申请
    const newApplication = new SectApplication({
      sectId,
      userId,
      username: user.username,
      level: character.level,
      message: message || '请求加入宗门',
      applicationDate: new Date(),
      status: 'pending'
    });
    
    // 保存申请
    await newApplication.save();
    
    // 如果宗门设置为自动接受成员，直接加入
    if (sect.settings.autoAcceptMembers) {
      // 找到最低级别的职位
      const lowestPosition = sect.positions
        .sort((a, b) => a.level - b.level)[0];
      
      // 创建新成员记录
      const newMember = {
        userId,
        name: user.username,
        joinDate: new Date(),
        position: lowestPosition.id,
        totalContribution: 0,
        weeklyContribution: 0,
        lastContributionReset: new Date(),
        status: 'active'
      };
      
      // 更新宗门成员列表
      sect.members.push(newMember);
      await sect.save();
      
      // 更新申请状态
      newApplication.status = 'approved';
      newApplication.processedBy = 'system';
      newApplication.processedDate = new Date();
      await newApplication.save();
      
      return res.status(200).json({
        success: true,
        message: '您的申请已自动批准，已成功加入宗门',
        data: {
          sectId: sect.sectId,
          sectName: sect.name,
          position: lowestPosition.name
        }
      });
    }
    
    res.status(200).json({
      success: true,
      message: '已成功提交加入申请，请等待宗门管理员审核',
      data: {
        applicationId: newApplication._id,
        sectName: sect.name,
        applicationDate: newApplication.applicationDate
      }
    });
  } catch (error) {
    console.error('申请加入宗门失败:', error);
    res.status(500).json({
      success: false,
      message: '申请加入宗门失败',
      error: error.message
    });
  }
};

/**
 * 获取用户所在宗门信息
 * Get user's sect information
 */
const getUserSect = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 查找用户所在的宗门
    const sect = await Sect.findOne({ 'members.userId': userId });
    
    if (!sect) {
      return res.status(404).json({
        success: false,
        message: '您当前不属于任何宗门'
      });
    }
    
    // 获取用户在宗门中的信息
    const memberInfo = sect.members.find(member => member.userId === userId);
    
    // 获取职位信息
    const position = sect.positions.find(pos => pos.id === memberInfo.position);
    
    // 构造用户可见的宗门信息
    const userSectView = {
      sectId: sect.sectId,
      name: sect.name,
      description: sect.description,
      level: sect.level,
      memberCount: sect.members.length,
      territory: sect.territory,
      memberInfo: {
        position: position ? position.name : '未知职位',
        joinDate: memberInfo.joinDate,
        totalContribution: memberInfo.totalContribution,
        weeklyContribution: memberInfo.weeklyContribution,
        status: memberInfo.status,
        permissions: position ? position.privileges : {}
      },
      facilities: sect.facilities.map(f => ({
        id: f.id,
        name: f.name,
        type: f.type,
        level: f.level,
        description: f.description,
        effects: f.effects
      })),
      techniques: sect.techniques.filter(t => {
        // 只返回已解锁或用户贡献值足够的功法
        return t.unlocked || memberInfo.totalContribution >= t.requirements.contribution;
      }).map(t => ({
        id: t.id,
        name: t.name,
        level: t.level,
        type: t.type,
        description: t.description,
        requirements: t.requirements,
        unlocked: t.unlocked
      }))
    };
    
    res.status(200).json({
      success: true,
      data: userSectView
    });
  } catch (error) {
    console.error('获取用户宗门信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户宗门信息失败',
      error: error.message
    });
  }
};

/**
 * 获取宗门成员列表
 * Get sect members
 */
const getSectMembers = async (req, res) => {
  try {
    const { sectId } = req.params;
    
    // 查找宗门
    const sect = await Sect.findOne({ sectId });
    
    if (!sect) {
      return res.status(404).json({
        success: false,
        message: '宗门不存在'
      });
    }
    
    // 检查宗门是否有成员
    if (!sect.members || sect.members.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: []
      });
    }
    
    // 获取成员列表及其职位信息
    const membersWithPositions = sect.members.map(member => {
      const position = sect.positions.find(pos => pos.id === member.position);
      return {
        userId: member.userId,
        name: member.name,
        position: position ? position.name : '未知职位',
        positionLevel: position ? position.level : 0,
        joinDate: member.joinDate,
        totalContribution: member.totalContribution,
        weeklyContribution: member.weeklyContribution,
        status: member.status
      };
    });
    
    // 按职位等级和贡献排序
    const sortedMembers = membersWithPositions.sort((a, b) => {
      // 首先按职位等级排序（降序）
      if (a.positionLevel !== b.positionLevel) {
        return b.positionLevel - a.positionLevel;
      }
      // 然后按总贡献排序（降序）
      return b.totalContribution - a.totalContribution;
    });
    
    res.status(200).json({
      success: true,
      count: sortedMembers.length,
      data: sortedMembers
    });
  } catch (error) {
    console.error('获取宗门成员列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取宗门成员列表失败',
      error: error.message
    });
  }
};

/**
 * 退出宗门
 * Leave sect
 */
const leaveSect = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // 查找用户所在的宗门
    const sect = await Sect.findOne({ 'members.userId': userId });
    
    if (!sect) {
      return res.status(404).json({
        success: false,
        message: '您当前不属于任何宗门'
      });
    }
    
    // 获取用户在宗门中的信息
    const memberIndex = sect.members.findIndex(member => member.userId === userId);
    const memberInfo = sect.members[memberIndex];
    
    // 获取职位信息
    const position = sect.positions.find(pos => pos.id === memberInfo.position);
    
    // 检查是否是创始人，创始人不能直接退出
    if (sect.founderUserId === userId) {
      return res.status(400).json({
        success: false,
        message: '您是宗门创始人，无法直接退出。请先转让宗主职位或解散宗门'
      });
    }
    
    // 移除成员
    sect.members.splice(memberIndex, 1);
    
    // 更新宗门历史记录
    sect.history.push({
      date: new Date(),
      event: '成员退出',
      description: `成员 ${memberInfo.name} (${position?.name || '无职位'}) 退出了宗门`,
      participants: [memberInfo.name]
    });
    
    await sect.save();
    
    res.status(200).json({
      success: true,
      message: `您已成功退出宗门 ${sect.name}`,
      data: {
        sectName: sect.name
      }
    });
  } catch (error) {
    console.error('退出宗门失败:', error);
    res.status(500).json({
      success: false,
      message: '退出宗门失败',
      error: error.message
    });
  }
};

/**
 * 贡献资源给宗门
 * Contribute resources to sect
 */
const contributeToSect = async (req, res) => {
  try {
    const userId = req.user.id;
    const { resourceType, amount } = req.body;
    
    // 验证必要参数
    if (!resourceType || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: '资源类型和数量为必填项，且数量必须大于0'
      });
    }
    
    // 查找用户所在的宗门
    const sect = await Sect.findOne({ 'members.userId': userId });
    
    if (!sect) {
      return res.status(404).json({
        success: false,
        message: '您当前不属于任何宗门'
      });
    }
    
    // 查找用户
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 检查资源类型和用户资源是否足够
    let userResource;
    let contributionValue;
    
    switch (resourceType) {
      case 'spiritStones':
        userResource = user.resources.spiritStones;
        contributionValue = amount * 1; // 1灵石=1贡献
        break;
      case 'gold':
        userResource = user.resources.gold;
        contributionValue = amount * 0.5; // 1金币=0.5贡献
        break;
      // 可以根据需要添加更多资源类型
      default:
        return res.status(400).json({
          success: false,
          message: '不支持的资源类型'
        });
    }
    
    if (userResource === undefined || userResource < amount) {
      return res.status(400).json({
        success: false,
        message: '资源不足'
      });
    }
    
    // 扣除用户资源
    if (resourceType === 'spiritStones') {
      user.resources.spiritStones -= amount;
    } else if (resourceType === 'gold') {
      user.resources.gold -= amount;
    }
    
    await user.save();
    
    // 增加宗门资源
    if (resourceType === 'spiritStones') {
      if (!sect.resources.spiritStones) {
        sect.resources.spiritStones = 0;
      }
      sect.resources.spiritStones += amount;
    } else {
      // 对于其他资源类型，检查材料列表中是否已存在
      if (!sect.resources.materials) {
        sect.resources.materials = [];
      }
      
      const materialIndex = sect.resources.materials.findIndex(m => m.type === resourceType);
      if (materialIndex !== -1) {
        sect.resources.materials[materialIndex].amount += amount;
      } else {
        sect.resources.materials.push({
          type: resourceType,
          amount: amount
        });
      }
    }
    
    // 计算并添加贡献值
    const contributionAmount = Math.floor(contributionValue);
    
    if (!sect.resources.contributionPoints) {
      sect.resources.contributionPoints = 0;
    }
    sect.resources.contributionPoints += contributionAmount;
    
    // 更新成员贡献记录
    const memberIndex = sect.members.findIndex(member => member.userId === userId);
    if (memberIndex !== -1) {
      sect.members[memberIndex].totalContribution += contributionAmount;
      sect.members[memberIndex].weeklyContribution += contributionAmount;
    }
    
    await sect.save();
    
    res.status(200).json({
      success: true,
      message: `成功向宗门贡献 ${amount} ${resourceType}，获得 ${contributionAmount} 点贡献值`,
      data: {
        contributionAmount,
        totalContribution: sect.members[memberIndex].totalContribution,
        weeklyContribution: sect.members[memberIndex].weeklyContribution,
        sectResources: {
          spiritStones: sect.resources.spiritStones,
          contributionPoints: sect.resources.contributionPoints
        }
      }
    });
  } catch (error) {
    console.error('贡献资源失败:', error);
    res.status(500).json({
      success: false,
      message: '贡献资源失败',
      error: error.message
    });
  }
};

// 导出函数
module.exports = {
  initializeSects,
  getAllSects,
  getSectById,
  createSect,
  applyToJoinSect,
  getUserSect,
  getSectMembers,
  leaveSect,
  contributeToSect
}; 