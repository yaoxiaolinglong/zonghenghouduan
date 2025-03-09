/**
 * 认证中间件
 * Authentication Middleware
 * 
 * 用于验证用户身份和保护需要认证的API路由
 * Used to verify user identity and protect API routes that require authentication
 */

const jwt = require('jsonwebtoken');

/**
 * 验证令牌中间件
 * Token verification middleware
 */
const authenticateToken = (req, res, next) => {
  // 从请求头中获取令牌
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN格式
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: '未提供认证令牌' 
    });
  }
  
  // 验证令牌
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        message: '令牌无效或已过期' 
      });
    }
    
    // 如果验证通过，将用户信息存入req对象中
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken }; 