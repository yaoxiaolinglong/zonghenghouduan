/**
 * 纵横天下游戏服务器
 * Zongheng Tianxia Game Server
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// 导入路由
const userRoutes = require('./routes/userRoutes');
const characterRoutes = require('./routes/characterRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cultivationRoutes = require('./routes/cultivationRoutes');
const realmRoutes = require('./routes/realmRoutes');
const artifactRoutes = require('./routes/artifactRoutes');
const pillRoutes = require('./routes/pillRoutes');
const beastRoutes = require('./routes/beastRoutes');
const beastEquipmentRoutes = require('./routes/beastEquipmentRoutes');
const beastSkillRoutes = require('./routes/beastSkillRoutes');
const secretRealmRoutes = require('./routes/secretRealmRoutes');
const playerRoutes = require('./routes/playerRoutes');
const sectRoutes = require('./routes/sectRoutes');

// 初始化控制器
const { initializeRealms, initializeArtifacts, initializePills } = require('./controllers/initData');
const { initializeBeasts } = require('./controllers/beastController_fixed');
const { initializeEquipment } = require('./controllers/beastEquipmentController');
const { initializeSecretRealms } = require('./controllers/secretRealmController');
const { initializeSects } = require('./controllers/sectController');

const app = express();

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// 路由
app.use('/api/users', userRoutes);
app.use('/api/characters', characterRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/cultivation', cultivationRoutes);
app.use('/api/realms', realmRoutes);
app.use('/api/artifacts', artifactRoutes);
app.use('/api/pills', pillRoutes);
app.use('/api/beasts', beastRoutes);
app.use('/api/beast-equipment', beastEquipmentRoutes);
app.use('/api/beast-skills', beastSkillRoutes);
app.use('/api/secret-realms', secretRealmRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/sects', sectRoutes);

// 测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: '纵横天下游戏服务器运行正常' });
});

// 根路由
app.get('/', (req, res) => {
  res.send('《纵横天下》游戏后端API服务');
});

// 数据库连接
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('数据库连接成功');
  
  // 初始化各系统数据
  try {
    initializeRealms();
    initializeArtifacts();
    initializePills();
    initializeBeasts();
    initializeEquipment();
    initializeSecretRealms();
    initializeSects();
    
    console.log('系统数据初始化完成');
  } catch (err) {
    console.error('数据初始化失败:', err);
  }
})
.catch(err => console.error('数据库连接失败', err));

// 启动服务器
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

module.exports = app; 