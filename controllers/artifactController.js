/**
 * 法宝系统控制器
 * Artifact System Controller
 * 
 * 处理法宝相关的业务逻辑
 * Handles business logic related to artifacts
 */

const Artifact = require('../models/Artifact');
const PlayerArtifact = require('../models/PlayerArtifact');
const Character = require('../models/Character');
const User = require('../models/User');
const Realm = require('../models/Realm');

// 获取所有法宝
exports.getAllArtifacts = async (req, res) => {
  try {
    const artifacts = await Artifact.find();
    res.status(200).json(artifacts);
  } catch (error) {
    console.error('获取法宝失败:', error);
    res.status(500).json({ error: '获取法宝失败' });
  }
};

// 获取玩家拥有的法宝
exports.getPlayerArtifacts = async (req, res) => {
  const { userId } = req.params;
  
  try {
    const playerArtifacts = await PlayerArtifact.find({ userId });
    
    // 获取法宝详细信息
    const artifactDetails = await Promise.all(
      playerArtifacts.map(async (playerArtifact) => {
        const artifact = await Artifact.findOne({ artifactId: playerArtifact.artifactId });
        return {
          ...playerArtifact.toObject(),
          details: artifact
        };
      })
    );
    
    res.status(200).json(artifactDetails);
  } catch (error) {
    console.error('获取玩家法宝失败:', error);
    res.status(500).json({ error: '获取玩家法宝失败' });
  }
};

// 获取法宝详情
exports.getArtifactDetails = async (req, res) => {
  const { artifactId } = req.params;
  
  try {
    const artifact = await Artifact.findOne({ artifactId });
    if (!artifact) {
      return res.status(404).json({ error: '法宝不存在' });
    }
    
    res.status(200).json(artifact);
  } catch (error) {
    console.error('获取法宝详情失败:', error);
    res.status(500).json({ error: '获取法宝详情失败' });
  }
};

// 装备法宝
exports.equipArtifact = async (req, res) => {
  const { userId, artifactId } = req.body;
  
  try {
    // 获取角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    // 获取玩家法宝
    const playerArtifact = await PlayerArtifact.findOne({ userId, artifactId });
    if (!playerArtifact) {
      return res.status(404).json({ error: '您没有这个法宝' });
    }
    
    // 获取法宝详情
    const artifact = await Artifact.findOne({ artifactId });
    if (!artifact) {
      return res.status(404).json({ error: '法宝不存在' });
    }
    
    // 检查境界要求
    if (character.realm.realmId !== artifact.realmRequired) {
      const requiredRealm = await Realm.findOne({ realmId: artifact.realmRequired });
      return res.status(400).json({ 
        error: '境界不足，无法装备此法宝', 
        required: requiredRealm.name,
        current: character.realm.realmId 
      });
    }
    
    // 如果已经装备了同类型的法宝，先卸下
    if (character.equippedArtifacts[artifact.type]) {
      const oldArtifactId = character.equippedArtifacts[artifact.type];
      await PlayerArtifact.updateOne(
        { userId, artifactId: oldArtifactId },
        { isEquipped: false }
      );
    }
    
    // 更新装备状态
    character.equippedArtifacts[artifact.type] = artifactId;
    await character.save();
    
    // 更新玩家法宝状态
    playerArtifact.isEquipped = true;
    playerArtifact.lastUsed = new Date();
    await playerArtifact.save();
    
    res.status(200).json({
      message: `成功装备法宝：${artifact.name}`,
      updatedCharacter: character
    });
  } catch (error) {
    console.error('装备法宝失败:', error);
    res.status(500).json({ error: '装备法宝失败' });
  }
};

// 卸下法宝
exports.unequipArtifact = async (req, res) => {
  const { userId, artifactId } = req.body;
  
  try {
    // 获取角色信息
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    // 获取玩家法宝
    const playerArtifact = await PlayerArtifact.findOne({ userId, artifactId });
    if (!playerArtifact) {
      return res.status(404).json({ error: '您没有这个法宝' });
    }
    
    // 获取法宝详情
    const artifact = await Artifact.findOne({ artifactId });
    if (!artifact) {
      return res.status(404).json({ error: '法宝不存在' });
    }
    
    // 检查是否已装备
    if (!playerArtifact.isEquipped) {
      return res.status(400).json({ error: '该法宝未装备' });
    }
    
    // 更新装备状态
    character.equippedArtifacts[artifact.type] = null;
    await character.save();
    
    // 更新玩家法宝状态
    playerArtifact.isEquipped = false;
    await playerArtifact.save();
    
    res.status(200).json({
      message: `成功卸下法宝：${artifact.name}`,
      updatedCharacter: character
    });
  } catch (error) {
    console.error('卸下法宝失败:', error);
    res.status(500).json({ error: '卸下法宝失败' });
  }
};

// 升级法宝
exports.upgradeArtifact = async (req, res) => {
  const { userId, artifactId } = req.body;
  
  try {
    // 获取玩家法宝
    const playerArtifact = await PlayerArtifact.findOne({ userId, artifactId });
    if (!playerArtifact) {
      return res.status(404).json({ error: '您没有这个法宝' });
    }
    
    // 获取法宝详情
    const artifact = await Artifact.findOne({ artifactId });
    if (!artifact) {
      return res.status(404).json({ error: '法宝不存在' });
    }
    
    // 检查是否达到最大等级
    if (playerArtifact.level >= artifact.maxLevel) {
      return res.status(400).json({ error: '该法宝已达到最大等级' });
    }
    
    // 获取用户信息，检查资源
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    // 计算升级所需灵石
    const spiritStonesRequired = artifact.upgradeRequirements.spiritStones * playerArtifact.level;
    
    // 检查灵石是否足够
    if (user.resources.spiritStones < spiritStonesRequired) {
      return res.status(400).json({ 
        error: '灵石不足', 
        required: spiritStonesRequired,
        current: user.resources.spiritStones
      });
    }
    
    // 扣除灵石
    user.resources.spiritStones -= spiritStonesRequired;
    await user.save();
    
    // 提升法宝等级
    playerArtifact.level += 1;
    
    // 计算新属性
    const levelMultiplier = 1 + (playerArtifact.level - 1) * 0.1;
    playerArtifact.attributes = {
      attack: Math.round(artifact.attributes.attack * levelMultiplier),
      defense: Math.round(artifact.attributes.defense * levelMultiplier),
      speed: Math.round(artifact.attributes.speed * levelMultiplier),
      spirit: Math.round(artifact.attributes.spirit * levelMultiplier),
      intelligence: Math.round(artifact.attributes.intelligence * levelMultiplier)
    };
    
    await playerArtifact.save();
    
    res.status(200).json({
      message: `法宝 ${artifact.name} 升级到 ${playerArtifact.level} 级`,
      updatedArtifact: playerArtifact,
      spiritStonesUsed: spiritStonesRequired
    });
  } catch (error) {
    console.error('升级法宝失败:', error);
    res.status(500).json({ error: '升级法宝失败' });
  }
};

// 获取法宝
exports.acquireArtifact = async (req, res) => {
  const { userId, artifactId } = req.body;
  
  try {
    // 检查法宝是否存在
    const artifact = await Artifact.findOne({ artifactId });
    if (!artifact) {
      return res.status(404).json({ error: '法宝不存在' });
    }
    
    // 检查用户是否已拥有该法宝
    const existingArtifact = await PlayerArtifact.findOne({ userId, artifactId });
    if (existingArtifact) {
      return res.status(400).json({ error: '您已拥有该法宝' });
    }
    
    // 创建玩家法宝记录
    const playerArtifact = new PlayerArtifact({
      userId,
      artifactId,
      level: 1,
      attributes: {
        attack: artifact.attributes.attack,
        defense: artifact.attributes.defense,
        speed: artifact.attributes.speed,
        spirit: artifact.attributes.spirit,
        intelligence: artifact.attributes.intelligence
      }
    });
    
    await playerArtifact.save();
    
    res.status(201).json({
      message: `获得法宝：${artifact.name}`,
      artifact: {
        ...playerArtifact.toObject(),
        details: artifact
      }
    });
  } catch (error) {
    console.error('获取法宝失败:', error);
    res.status(500).json({ error: '获取法宝失败' });
  }
}; 