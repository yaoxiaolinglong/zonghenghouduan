/**
 * 游戏配置文件
 * Game Configuration File
 * 
 * 包含数据库连接信息和其他配置参数
 * Contains database connection information and other configuration parameters
 */

require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/zongheng-tianxia',
  jwtSecret: process.env.JWT_SECRET || 'zongheng_secret_key',
  jwtExpire: '24h',
  port: process.env.PORT || 5000
}; 