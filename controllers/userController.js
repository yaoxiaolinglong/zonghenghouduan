const User = require('../models/User');
const Character = require('../models/Character');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateId } = require('../utils/idGenerator');

// 注册新用户
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 验证用户输入
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码为必填项'
      });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      });
    }

    // 哈希密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();
    
    // 创建角色
    const newCharacter = new Character({
      userId: newUser._id,
      name: username, // 初始角色名与用户名相同
      level: 1,
      realm: {
        name: '练气期',
        level: 1
      }
    });
    
    await newCharacter.save();

    // 生成JWT令牌
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: '用户注册成功',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        level: newUser.level,
        experience: newUser.experience
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: '密码错误' });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 返回令牌和用户信息（不包含密码）
    const userResponse = {
      _id: user._id,
      username: user.username,
      level: user.level,
      experience: user.experience,
      resources: user.resources
    };

    res.status(200).json({ token, user: userResponse });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ error: '登录失败' });
  }
}; 