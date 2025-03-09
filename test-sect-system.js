/**
 * 宗门系统测试脚本
 * Sect System Test Script
 * 
 * 测试宗门系统的各项功能
 * Test various functionalities of the sect system
 */

const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// MongoDB连接字符串
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/zongheng';

// 测试用户
const testUser = {
  username: `test_user_${Date.now()}`,
  password: 'password123'
};

// 测试宗门
const testSect = {
  name: `测试宗门_${Date.now()}`,
  description: '这是一个用于测试的宗门',
  territory: {
    environment: 'mountain'
  },
  settings: {
    autoAcceptMembers: true
  }
};

// 存储令牌和ID
let token;
let userId;
let sectId;

// 测试结果统计
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  skipped: 0
};

// 测试用户创建函数
async function createTestUser() {
  try {
    console.log(`创建测试用户: ${testUser.username}`);
    const response = await axios.post(`${API_BASE_URL}/users/register`, testUser);
    token = response.data.token;
    userId = response.data.user.id;
    console.log('测试用户创建成功，获取到令牌');
    return true;
  } catch (error) {
    console.error('创建测试用户失败:', error.response?.data || error.message);
    return false;
  }
}

// 删除测试用户函数
async function cleanupTestUser() {
  console.log('清理测试数据...');
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db();
    
    // 删除测试用户
    if (userId) {
      await db.collection('users').deleteOne({ _id: userId });
      await db.collection('characters').deleteOne({ userId });
      console.log('测试用户已删除');
    }
    
    // 删除测试宗门
    if (sectId) {
      await db.collection('sects').deleteOne({ sectId });
      console.log('测试宗门已删除');
    }
    
    await client.close();
  } catch (error) {
    console.error('清理测试数据失败:', error);
  }
}

// 测试帮助函数
async function runTest(name, testFn) {
  testResults.total++;
  try {
    console.log(`\n开始测试: ${name}`);
    const startTime = Date.now();
    const result = await testFn();
    const duration = Date.now() - startTime;
    
    if (result === true) {
      console.log(`✓ 测试通过: ${name} (${duration}ms)`);
      testResults.passed++;
      return true;
    } else if (result === 'skipped') {
      console.log(`- 测试跳过: ${name}`);
      testResults.skipped++;
      return 'skipped';
    } else {
      console.log(`✗ 测试失败: ${name} (${duration}ms)`);
      testResults.failed++;
      return false;
    }
  } catch (error) {
    console.error(`测试执行错误: ${error.message}`);
    console.log(`✗ 测试失败: ${name}`);
    testResults.failed++;
    return false;
  }
}

// 测试函数：获取所有宗门
async function testGetAllSects() {
  try {
    const response = await axios.get(`${API_BASE_URL}/sects/all`);
    console.log(`获取到 ${response.data.count} 个宗门`);
    return response.data.success === true && Array.isArray(response.data.data);
  } catch (error) {
    console.error('获取宗门列表失败:', error.response?.data || error.message);
    return false;
  }
}

// 测试函数：创建宗门
async function testCreateSect() {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await axios.post(`${API_BASE_URL}/sects/create`, testSect, config);
    
    if (response.data.success && response.data.data) {
      sectId = response.data.data.sectId;
      console.log(`成功创建宗门: ${response.data.data.name} (ID: ${sectId})`);
      return true;
    } else {
      console.error('创建宗门失败:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('创建宗门失败:', error.response?.data || error.message);
    return false;
  }
}

// 测试函数：获取宗门详情
async function testGetSectDetails() {
  if (!sectId) {
    console.log('跳过测试: 没有可用的宗门ID');
    return 'skipped';
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/sects/${sectId}`);
    console.log(`获取到宗门详情: ${response.data.data.name}`);
    return response.data.success === true && response.data.data.sectId === sectId;
  } catch (error) {
    console.error('获取宗门详情失败:', error.response?.data || error.message);
    return false;
  }
}

// 测试函数：获取用户宗门信息
async function testGetUserSect() {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await axios.get(`${API_BASE_URL}/sects/user/mysect`, config);
    console.log(`获取到用户宗门信息: ${response.data.data?.name || '无'}`);
    return response.data.success === true;
  } catch (error) {
    // 如果用户没有宗门，API可能返回404，这也是正常的
    if (error.response && error.response.status === 404) {
      console.log('用户没有加入任何宗门');
      return true;
    }
    console.error('获取用户宗门信息失败:', error.response?.data || error.message);
    return false;
  }
}

// 测试函数：获取宗门成员列表
async function testGetSectMembers() {
  if (!sectId) {
    console.log('跳过测试: 没有可用的宗门ID');
    return 'skipped';
  }
  
  try {
    const response = await axios.get(`${API_BASE_URL}/sects/${sectId}/members`);
    console.log(`获取到宗门成员: ${response.data.count} 人`);
    return response.data.success === true && Array.isArray(response.data.data);
  } catch (error) {
    console.error('获取宗门成员列表失败:', error.response?.data || error.message);
    return false;
  }
}

// 测试函数：申请加入宗门
async function testApplyToJoinSect() {
  if (!sectId) {
    console.log('跳过测试: 没有可用的宗门ID');
    return 'skipped';
  }
  
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await axios.post(`${API_BASE_URL}/sects/apply`, {
      sectId,
      message: '这是一条测试申请消息'
    }, config);
    
    console.log(`申请加入宗门结果: ${response.data.message}`);
    return response.data.success === true;
  } catch (error) {
    // 如果用户已经是宗门成员，API可能返回400，这也是正常的
    if (error.response && error.response.status === 400 && error.response.data.message.includes('已经是')) {
      console.log('用户已经是宗门成员');
      return true;
    }
    console.error('申请加入宗门失败:', error.response?.data || error.message);
    return false;
  }
}

// 测试函数：贡献资源
async function testContributeToSect() {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await axios.post(`${API_BASE_URL}/sects/contribute`, {
      resourceType: 'spiritStones',
      amount: 10
    }, config);
    
    console.log(`贡献资源结果: ${response.data.message}`);
    return response.data.success === true;
  } catch (error) {
    console.error('贡献资源失败:', error.response?.data || error.message);
    return false;
  }
}

// 测试函数：退出宗门
async function testLeaveSect() {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    const response = await axios.post(`${API_BASE_URL}/sects/leave`, {}, config);
    
    console.log(`退出宗门结果: ${response.data.message}`);
    return response.data.success === true;
  } catch (error) {
    // 如果用户是宗门创始人，API可能返回400，这也是正常的
    if (error.response && error.response.status === 400 && error.response.data.message.includes('创始人')) {
      console.log('用户是宗门创始人，无法退出');
      return true;
    }
    // 如果用户没有加入宗门，API可能返回404，这也是正常的
    if (error.response && error.response.status === 404) {
      console.log('用户没有加入任何宗门');
      return true;
    }
    console.error('退出宗门失败:', error.response?.data || error.message);
    return false;
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('=== 宗门系统测试开始 ===');
  
  // 创建测试用户
  const userCreated = await createTestUser();
  if (!userCreated) {
    console.error('无法创建测试用户，测试终止');
    return;
  }
  
  // 运行测试
  await runTest('获取所有宗门', testGetAllSects);
  await runTest('创建宗门', testCreateSect);
  await runTest('获取宗门详情', testGetSectDetails);
  await runTest('获取用户宗门信息', testGetUserSect);
  await runTest('获取宗门成员列表', testGetSectMembers);
  await runTest('申请加入宗门', testApplyToJoinSect);
  await runTest('贡献资源', testContributeToSect);
  await runTest('退出宗门', testLeaveSect);
  
  // 清理测试数据
  await cleanupTestUser();
  
  // 输出测试结果
  console.log('\n=== 测试结果统计 ===');
  console.log(`总计: ${testResults.passed}/${testResults.total} 通过 (${Math.round(testResults.passed / testResults.total * 100)}%)`);
  console.log(`通过: ${testResults.passed}`);
  console.log(`失败: ${testResults.failed}`);
  console.log(`跳过: ${testResults.skipped}`);
  console.log('\n=== 测试结束 ===');
}

// 执行测试
runAllTests(); 