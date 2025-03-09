const Character = require('../models/Character');

// 获取角色信息
exports.getCharacter = async (req, res) => {
  const { userId } = req.params;

  try {
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    res.status(200).json(character);
  } catch (error) {
    console.error('获取角色信息失败:', error);
    res.status(500).json({ error: '获取角色信息失败' });
  }
};

// 更新角色信息
exports.updateCharacter = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const character = await Character.findOneAndUpdate(
      { userId }, 
      updates, 
      { new: true }
    );
    
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }
    
    res.status(200).json(character);
  } catch (error) {
    console.error('更新角色信息失败:', error);
    res.status(500).json({ error: '更新角色信息失败' });
  }
}; 