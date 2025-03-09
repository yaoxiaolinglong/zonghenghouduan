/**
 * 《纵横天下》游戏新功能测试脚本
 * Test Script for New Features of "Zongheng Tianxia" Game
 * 
 * 该脚本用于测试新添加的境界系统、法宝系统和丹药系统功能
 * This script is used to test the newly added Realm, Artifact, and Pill system features
 */

const axios = require('axios');
const API_URL = 'http://localhost:5000/api';
let token = null;
let userId = null;
let testPassed = 0;
let testFailed = 0;

// 测试用户信息
const testUser = {
  username: 'newfeaturetest',
  password: 'password123'
};

// 测试数据
const testData = {
  realm: {
    realmId: 'realm_001' // 炼气期
  },
  artifact: {
    artifactId: 'artifact_001' // 青锋剑
  },
  pill: {
    pillId: 'pill_001', // 聚气丹
    quantity: 3
  }
};

// 工具函数：打印测试结果
function printResult(testName, success, data) {
  if (success) {
    console.log(`✅ 【测试通过】${testName}`);
    testPassed++;
  } else {
    console.log(`❌ 【测试失败】${testName}: ${data && data.error ? data.error : JSON.stringify(data)}`);
    testFailed++;
  }
  if (data && !data.error) {
    console.log('📋 结果:', JSON.stringify(data, null, 2));
  }
  console.log('-'.repeat(80));
}

// 工具函数：发送请求
async function apiRequest(method, endpoint, data = null, auth = false) {
  try {
    const config = {
      headers: auth && token ? { Authorization: `Bearer ${token}` } : {}
    };
    
    let response;
    if (method === 'get') {
      response = await axios.get(`${API_URL}${endpoint}`, config);
    } else if (method === 'post') {
      response = await axios.post(`${API_URL}${endpoint}`, data, config);
    } else if (method === 'put') {
      response = await axios.put(`${API_URL}${endpoint}`, data, config);
    }
    
    return { success: true, data: response.data };
  } catch (error) {
    return { 
      success: false, 
      error: error.response ? error.response.data : error.message 
    };
  }
}

// 注册测试用户
async function registerUser() {
  console.log('🔐 注册测试用户...');
  const result = await apiRequest('post', '/users/register', testUser);
  printResult('用户注册', result.success, result.data);
  return result.success;
}

// 登录测试用户
async function loginUser() {
  console.log('🔑 登录测试用户...');
  const result = await apiRequest('post', '/users/login', testUser);
  if (result.success) {
    token = result.data.token;
    userId = result.data.user._id;
  }
  printResult('用户登录', result.success, result.success ? { token: '***', userId } : result.error);
  return result.success;
}

// 测试境界系统
async function testRealmSystem() {
  console.log('\n🏯 测试境界系统...');
  
  // 获取所有境界
  const allRealms = await apiRequest('get', '/realms');
  printResult('获取所有境界', allRealms.success, allRealms.data);
  
  if (!allRealms.success) return false;
  
  // 获取角色当前境界
  const charRealm = await apiRequest('get', `/realms/${userId}`, null, true);
  printResult('获取角色当前境界', charRealm.success, charRealm.data);
  
  return allRealms.success && charRealm.success;
}

// 测试法宝系统
async function testArtifactSystem() {
  console.log('\n⚔️ 测试法宝系统...');
  
  // 获取所有法宝
  const allArtifacts = await apiRequest('get', '/artifacts');
  printResult('获取所有法宝', allArtifacts.success, allArtifacts.data);
  
  if (!allArtifacts.success) return false;
  
  // 获取法宝详情
  const artifactDetails = await apiRequest('get', `/artifacts/${testData.artifact.artifactId}`);
  printResult('获取法宝详情', artifactDetails.success, artifactDetails.data);
  
  // 获取法宝
  const acquireArtifact = await apiRequest('post', '/artifacts/acquire', {
    userId,
    artifactId: testData.artifact.artifactId
  }, true);
  printResult('获取法宝', acquireArtifact.success, acquireArtifact.data);
  
  // 获取玩家法宝
  const playerArtifacts = await apiRequest('get', `/artifacts/player/${userId}`, null, true);
  printResult('获取玩家法宝', playerArtifacts.success, playerArtifacts.data);
  
  // 装备法宝
  const equipArtifact = await apiRequest('post', '/artifacts/equip', {
    userId,
    artifactId: testData.artifact.artifactId
  }, true);
  printResult('装备法宝', equipArtifact.success, equipArtifact.data);
  
  // 升级法宝
  const upgradeArtifact = await apiRequest('post', '/artifacts/upgrade', {
    userId,
    artifactId: testData.artifact.artifactId
  }, true);
  printResult('升级法宝', upgradeArtifact.success, upgradeArtifact.data);
  
  // 卸下法宝
  const unequipArtifact = await apiRequest('post', '/artifacts/unequip', {
    userId,
    artifactId: testData.artifact.artifactId
  }, true);
  printResult('卸下法宝', unequipArtifact.success, unequipArtifact.data);
  
  return allArtifacts.success && artifactDetails.success && 
         acquireArtifact.success && playerArtifacts.success &&
         equipArtifact.success && upgradeArtifact.success &&
         unequipArtifact.success;
}

// 测试丹药系统
async function testPillSystem() {
  console.log('\n💊 测试丹药系统...');
  
  // 获取所有丹药
  const allPills = await apiRequest('get', '/pills');
  printResult('获取所有丹药', allPills.success, allPills.data);
  
  if (!allPills.success) return false;
  
  // 获取丹药详情
  const pillDetails = await apiRequest('get', `/pills/${testData.pill.pillId}`);
  printResult('获取丹药详情', pillDetails.success, pillDetails.data);
  
  // 获取丹药
  const acquirePill = await apiRequest('post', '/pills/acquire', {
    userId,
    pillId: testData.pill.pillId,
    quantity: testData.pill.quantity
  }, true);
  printResult('获取丹药', acquirePill.success, acquirePill.data);
  
  // 获取玩家丹药
  const playerPills = await apiRequest('get', `/pills/player/${userId}`, null, true);
  printResult('获取玩家丹药', playerPills.success, playerPills.data);
  
  // 开始修炼（为了测试丹药效果）
  const startCultivation = await apiRequest('post', '/cultivation/start', {
    userId,
    techniqueId: 'basic',
    location: 'default'
  }, true);
  printResult('开始修炼', startCultivation.success, startCultivation.data);
  
  // 使用丹药
  const usePill = await apiRequest('post', '/pills/use', {
    userId,
    pillId: testData.pill.pillId
  }, true);
  printResult('使用丹药', usePill.success, usePill.data);
  
  // 获取当前生效的丹药效果
  const activeEffects = await apiRequest('get', `/pills/effects/${userId}`, null, true);
  printResult('获取当前生效的丹药效果', activeEffects.success, activeEffects.data);
  
  // 结束修炼
  const endCultivation = await apiRequest('post', '/cultivation/end', {
    userId
  }, true);
  printResult('结束修炼', endCultivation.success, endCultivation.data);
  
  return allPills.success && pillDetails.success && 
         acquirePill.success && playerPills.success &&
         usePill.success && activeEffects.success;
}

// 初始化游戏数据
async function initGameData() {
  console.log('\n🎮 初始化游戏数据...');
  
  try {
    // 使用node脚本初始化游戏数据
    const { execSync } = require('child_process');
    const output = execSync('node scripts/initGameData.js', { encoding: 'utf8' });
    console.log(output);
    return true;
  } catch (error) {
    console.error('初始化游戏数据失败:', error.message);
    return false;
  }
}

// 主测试函数
async function runTests() {
  console.log('\n🎮 开始测试《纵横天下》游戏新功能...');
  console.log('='.repeat(80));
  
  // 初始化游戏数据
  const initSuccess = await initGameData();
  if (!initSuccess) {
    console.log('❌ 初始化游戏数据失败，无法继续测试');
    return;
  }
  
  // 注册和登录用户
  const registerSuccess = await registerUser();
  if (!registerSuccess) {
    // 如果注册失败，尝试直接登录
    console.log('尝试直接登录...');
  }
  
  const loginSuccess = await loginUser();
  if (!loginSuccess) {
    console.log('❌ 登录失败，无法继续测试');
    return;
  }
  
  // 测试境界系统
  await testRealmSystem();
  
  // 测试法宝系统
  await testArtifactSystem();
  
  // 测试丹药系统
  await testPillSystem();
  
  // 打印测试总结
  console.log('\n📊 测试总结:');
  console.log('='.repeat(80));
  console.log(`✅ 通过测试: ${testPassed}`);
  console.log(`❌ 失败测试: ${testFailed}`);
  console.log(`🎯 总测试数: ${testPassed + testFailed}`);
  console.log(`📈 通过率: ${Math.round(testPassed / (testPassed + testFailed) * 100)}%`);
  console.log('='.repeat(80));
}

// 运行测试
runTests().catch(error => {
  console.error('测试过程中发生错误:', error);
  process.exit(1);
}); 