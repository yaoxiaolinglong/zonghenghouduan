/**
 * 宗门系统简单测试
 * Simple Sect System Test
 */

const axios = require('axios');

// API基础URL
const API_BASE_URL = 'http://localhost:5000/api';

// 保存测试数据
let sectId = '';
let token = '';
let userId = '';
const testUser = {
  username: `test_user_${Date.now()}`,
  password: 'password123'
};

// 测试用户注册
async function testRegisterUser() {
  try {
    console.log(`测试用户注册 (${testUser.username})...`);
    const response = await axios.post(`${API_BASE_URL}/users/register`, testUser);
    console.log('响应状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
    if (response.data.token) {
      token = response.data.token;
      userId = response.data.user.id;
      console.log(`获取到令牌: ${token.substring(0, 10)}...`);
      console.log(`获取到用户ID: ${userId}`);
      return true;
    } else {
      console.error('注册成功但未获取到令牌');
      return false;
    }
  } catch (error) {
    console.error('请求失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 测试创建宗门
async function testCreateSect() {
  if (!token) {
    console.log('跳过创建宗门测试: 未获取到认证令牌');
    return null;
  }
  
  const sectData = {
    name: `测试宗门_${Date.now()}`,
    description: '这是一个用于测试的宗门',
    territory: {
      environment: 'mountain'
    }
  };
  
  try {
    console.log(`测试创建宗门 (${sectData.name})...`);
    const response = await axios.post(
      `${API_BASE_URL}/sects/create`, 
      sectData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('响应状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
    if (response.data.data && response.data.data.sectId) {
      sectId = response.data.data.sectId;
      console.log(`创建的宗门ID: ${sectId}`);
      return true;
    } else {
      console.error('创建宗门成功但未获取到宗门ID');
      return false;
    }
  } catch (error) {
    console.error('请求失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 测试获取用户宗门信息
async function testGetUserSect() {
  if (!token) {
    console.log('跳过获取用户宗门信息测试: 未获取到认证令牌');
    return null;
  }
  
  try {
    console.log('测试获取用户宗门信息...');
    const response = await axios.get(
      `${API_BASE_URL}/sects/user/mysect`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('响应状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    // 如果用户没有宗门，API可能返回404，这是预期行为
    if (error.response && error.response.status === 404) {
      console.log('用户没有加入宗门 (这可能是正常的)');
      return true;
    }
    
    console.error('请求失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 测试获取所有宗门
async function testGetAllSects() {
  try {
    console.log('测试获取所有宗门...');
    const response = await axios.get(`${API_BASE_URL}/sects/all`);
    console.log('响应状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    
    // 如果还没有通过创建宗门获取sectId，使用列表中的第一个
    if (!sectId && response.data.data && response.data.data.length > 0) {
      sectId = response.data.data[0].sectId;
      console.log(`获取到宗门ID: ${sectId}`);
    }
    
    return true;
  } catch (error) {
    console.error('请求失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 测试获取宗门详情
async function testGetSectDetails() {
  if (!sectId) {
    console.log('跳过宗门详情测试: 没有可用的宗门ID');
    return null;
  }
  
  try {
    console.log(`测试获取宗门详情 (ID: ${sectId})...`);
    const response = await axios.get(`${API_BASE_URL}/sects/${sectId}`);
    console.log('响应状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('请求失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 测试获取宗门成员列表
async function testGetSectMembers() {
  if (!sectId) {
    console.log('跳过宗门成员列表测试: 没有可用的宗门ID');
    return null;
  }
  
  try {
    console.log(`测试获取宗门成员列表 (ID: ${sectId})...`);
    const response = await axios.get(`${API_BASE_URL}/sects/${sectId}/members`);
    console.log('响应状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('请求失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 测试贡献资源
async function testContributeToSect() {
  if (!token) {
    console.log('跳过贡献资源测试: 未获取到认证令牌');
    return null;
  }
  
  const contributionData = {
    resourceType: 'spiritStones',
    amount: 10
  };
  
  try {
    console.log(`测试贡献资源 (${contributionData.amount} ${contributionData.resourceType})...`);
    const response = await axios.post(
      `${API_BASE_URL}/sects/contribute`, 
      contributionData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('响应状态码:', response.status);
    console.log('响应数据:', JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.error('请求失败:', error.message);
    if (error.response) {
      console.error('响应状态码:', error.response.status);
      console.error('响应数据:', error.response.data);
    }
    return false;
  }
}

// 运行测试
async function runTests() {
  console.log('=== 宗门系统简单测试开始 ===');
  
  // 测试用户注册
  const registerResult = await testRegisterUser();
  if (registerResult) {
    console.log('✓ 测试通过: 用户注册');
  } else {
    console.log('✗ 测试失败: 用户注册');
  }
  
  // 测试创建宗门
  const createSectResult = await testCreateSect();
  if (createSectResult === true) {
    console.log('✓ 测试通过: 创建宗门');
  } else if (createSectResult === false) {
    console.log('✗ 测试失败: 创建宗门');
  } else {
    console.log('- 测试跳过: 创建宗门');
  }
  
  // 测试获取用户宗门信息
  const getUserSectResult = await testGetUserSect();
  if (getUserSectResult === true) {
    console.log('✓ 测试通过: 获取用户宗门信息');
  } else if (getUserSectResult === false) {
    console.log('✗ 测试失败: 获取用户宗门信息');
  } else {
    console.log('- 测试跳过: 获取用户宗门信息');
  }
  
  // 测试获取所有宗门
  const getAllSectsResult = await testGetAllSects();
  if (getAllSectsResult) {
    console.log('✓ 测试通过: 获取所有宗门');
  } else {
    console.log('✗ 测试失败: 获取所有宗门');
  }
  
  // 测试获取宗门详情
  const getSectDetailsResult = await testGetSectDetails();
  if (getSectDetailsResult === true) {
    console.log('✓ 测试通过: 获取宗门详情');
  } else if (getSectDetailsResult === false) {
    console.log('✗ 测试失败: 获取宗门详情');
  } else {
    console.log('- 测试跳过: 获取宗门详情');
  }
  
  // 测试获取宗门成员列表
  const getSectMembersResult = await testGetSectMembers();
  if (getSectMembersResult === true) {
    console.log('✓ 测试通过: 获取宗门成员列表');
  } else if (getSectMembersResult === false) {
    console.log('✗ 测试失败: 获取宗门成员列表');
  } else {
    console.log('- 测试跳过: 获取宗门成员列表');
  }
  
  // 测试贡献资源
  const contributeToSectResult = await testContributeToSect();
  if (contributeToSectResult === true) {
    console.log('✓ 测试通过: 贡献资源');
  } else if (contributeToSectResult === false) {
    console.log('✗ 测试失败: 贡献资源');
  } else {
    console.log('- 测试跳过: 贡献资源');
  }
  
  console.log('=== 测试结束 ===');
}

runTests(); 