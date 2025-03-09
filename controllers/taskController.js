const Task = require('../models/Task');
const Character = require('../models/Character');
const User = require('../models/User');

// 获取所有任务
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('获取任务失败:', error);
    res.status(500).json({ error: '获取任务失败' });
  }
};

// 创建测试任务（仅用于测试）
exports.createTestTask = async (req, res) => {
  try {
    const taskData = req.body;
    const newTask = new Task(taskData);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('创建测试任务失败:', error);
    res.status(500).json({ error: '创建测试任务失败' });
  }
};

// 完成任务并更新角色信息
exports.completeTask = async (req, res) => {
  const { userId, taskId } = req.body;

  try {
    // 查找任务
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: '任务不存在' });
    }

    // 查找角色
    const character = await Character.findOne({ userId });
    if (!character) {
      return res.status(404).json({ error: '角色不存在' });
    }

    // 更新角色属性
    character.experience += task.reward.experience;
    character.resources.gold += task.reward.gold;
    character.resources.spiritStones += task.reward.spiritStones;

    // 检查是否升级
    if (character.experience >= 100) {
      character.level += 1;
      character.experience -= 100;
      
      // 同步更新用户等级
      await User.findByIdAndUpdate(userId, { 
        level: character.level,
        experience: character.experience,
        resources: character.resources
      });
    }

    await character.save();
    res.status(200).json({ 
      message: '任务完成', 
      updatedCharacter: character 
    });
  } catch (error) {
    console.error('完成任务失败:', error);
    res.status(500).json({ error: '完成任务失败' });
  }
}; 