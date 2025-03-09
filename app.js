const artifactRoutes = require('./routes/artifactRoutes');
const pillRoutes = require('./routes/pillRoutes');
const beastRoutes = require('./routes/beastRoutes');
const sectRoutes = require('./routes/sectRoutes');

// 初始化数据
const { initializeRealms } = require('./controllers/realmController');
const { initializeArtifacts } = require('./controllers/artifactController');
const { initializePills } = require('./controllers/pillController');
const { initializeBeasts } = require('./controllers/beastController');
const { initializeSects } = require('./controllers/sectController');

// 注册路由
app.use('/api/auth', authRoutes);
app.use('/api/realms', realmRoutes);
app.use('/api/artifacts', artifactRoutes);
app.use('/api/pills', pillRoutes);
app.use('/api/beasts', beastRoutes);
app.use('/api/sects', sectRoutes);

// 数据库连接成功后初始化数据
mongoose.connection.once('open', async () => {
  console.log('MongoDB database connection established successfully');
  
  try {
    // 初始化游戏数据
    await initializeRealms();
    await initializeArtifacts();
    await initializePills();
    await initializeBeasts();
    await initializeSects();
  } catch (error) {
    console.error('Error initializing data:', error);
  }
}); 