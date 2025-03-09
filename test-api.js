/**
 * 《纵横天下》游戏后端API测试脚本
 * API Test Script for "Zongheng Tianxia" Game Backend
 * 
 * 这个脚本用于测试游戏后端的各个API接口
 * This script is used to test various API endpoints of the game backend
 */

const axios = require('axios');

// API基础URL
const BASE_URL = 'http://localhost:5000/api';
let token = null;
let userId = null;

// 测试用户信息
const testUser = {
  username: 'testuser999',
  password: 'password123'
};

// 测试角色更新信息
const characterUpdate = {
  attributes: {
    strength: 15,
    agility: 12
  }
};

// 测试任务数据
const testTask = {
  name: '测试任务',
  description: '这是一个测试任务',
  reward: {
    experience: 50,
    gold: 100,
    spiritStones: 20
  },
  condition: '完成测试',
  difficulty: '简单'
};

// 测试任务完成信息
const taskComplete = {
  taskId: null
};

// 1. 测试用户注册API
async function testRegister() {
  console.log('测试用户注册API...');
  try {
    const response = await axios.post(`${BASE_URL}/users/register`, testUser);
    console.log('注册成功:', response.data);
    return true;
  } catch (error) {
    console.error('注册失败:', error.response ? error.response.data : error.message);
    return false;
  }
}

// 2. 测试用户登录API
async function testLogin() {
  console.log('测试用户登录API...');
  try {
    const response = await axios.post(`${BASE_URL}/users/login`, testUser);
    console.log('登录成功:', response.data);
    token = response.data.token;
    userId = response.data.user._id;
    return true;
  } catch (error) {
    console.error('登录失败:', error.response ? error.response.data : error.message);
    return false;
  }
}

// 3. 测试获取角色信息API
async function testGetCharacter() {
  console.log('测试获取角色信息API...');
  try {
    const response = await axios.get(`${BASE_URL}/characters/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('获取角色信息成功:', response.data);
    return true;
  } catch (error) {
    console.error('获取角色信息失败:', error.response ? error.response.data : error.message);
    return false;
  }
}

// 4. 测试更新角色信息API
async function testUpdateCharacter() {
  console.log('测试更新角色信息API...');
  try {
    const response = await axios.put(`${BASE_URL}/characters/${userId}`, characterUpdate, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('更新角色信息成功:', response.data);
    return true;
  } catch (error) {
    console.error('更新角色信息失败:', error.response ? error.response.data : error.message);
    return false;
  }
}

// 4.5 创建测试任务（直接操作数据库）
async function createTestTask() {
  console.log('创建测试任务...');
  try {
    // 使用MongoDB直接创建任务
    const response = await axios.post(`${BASE_URL}/tasks/create-test`, testTask, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('创建测试任务成功:', response.data);
    return response.data;
  } catch (error) {
    console.error('创建测试任务失败:', error.response ? error.response.data : error.message);
    // 如果API不存在，我们可以继续测试
    return null;
  }
}

// 5. 测试获取所有任务API
async function testGetAllTasks() {
  console.log('测试获取所有任务API...');
  try {
    const response = await axios.get(`${BASE_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('获取所有任务成功:', response.data);
    
    // 如果有任务，保存第一个任务的ID用于测试完成任务
    if (response.data && response.data.length > 0) {
      taskComplete.taskId = response.data[0]._id;
    }
    
    return true;
  } catch (error) {
    console.error('获取所有任务失败:', error.response ? error.response.data : error.message);
    return false;
  }
}

// 6. 测试完成任务API
async function testCompleteTask() {
  if (!taskComplete.taskId) {
    console.log('没有可用的任务ID，跳过完成任务测试');
    return false;
  }
  
  console.log('测试完成任务API...');
  try {
    const payload = {
      userId: userId,
      taskId: taskComplete.taskId
    };
    
    const response = await axios.post(`${BASE_URL}/tasks/complete`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('完成任务成功:', response.data);
    return true;
  } catch (error) {
    console.error('完成任务失败:', error.response ? error.response.data : error.message);
    return false;
  }
}

// 7. 测试修炼系统API
async function testCultivationSystem() {
  console.log('\n测试修炼系统API...');
  
  // 7.1 开始修炼
  console.log('测试开始修炼API...');
  try {
    const startPayload = {
      userId: userId,
      techniqueId: 'skill_001', // 吐纳术
      location: 'mountain'      // 灵山
    };
    
    const startResponse = await axios.post(`${BASE_URL}/cultivation/start`, startPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('开始修炼成功:', startResponse.data);
    
    // 7.2 获取修炼状态
    console.log('测试获取修炼状态API...');
    const statusResponse = await axios.get(`${BASE_URL}/cultivation/status/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('获取修炼状态成功:', statusResponse.data);
    
    // 等待一段时间模拟修炼
    console.log('模拟修炼中，等待5秒...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 7.3 结束修炼
    console.log('测试结束修炼API...');
    const endPayload = {
      userId: userId
    };
    
    const endResponse = await axios.post(`${BASE_URL}/cultivation/end`, endPayload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('结束修炼成功:', endResponse.data);
    
    // 7.4 尝试突破
    console.log('测试尝试突破API...');
    const attemptResponse = await axios.post(`${BASE_URL}/cultivation/breakthrough/attempt`, { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('尝试突破成功:', attemptResponse.data);
    
    // 等待一段时间模拟突破
    console.log('模拟突破中，等待5秒...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 7.5 完成突破
    console.log('测试完成突破API...');
    const completeResponse = await axios.post(`${BASE_URL}/cultivation/breakthrough/complete`, { userId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('完成突破:', completeResponse.data);
    
    return true;
  } catch (error) {
    console.error('修炼系统测试失败:', error.response ? error.response.data : error.message);
    return false;
  }
}

async function testBeastSystem() {
  console.log('\n===== 测试灵兽系统 =====');
  
  try {
    // 获取灵兽图鉴
    console.log('\n1. 获取灵兽图鉴:');
    const beastsResponse = await axios.get(`${BASE_URL}/beasts/beasts`);
    console.log(`获取灵兽图鉴成功，共 ${beastsResponse.data.data.length} 种灵兽`);
    
    // 尝试捕获一只灵兽
    const beastId = beastsResponse.data.data[0].beastId;
    console.log(`\n2. 尝试捕获灵兽 (${beastId}):`);
    const captureResponse = await axios.post(
      `${BASE_URL}/beasts/capture`,
      {
        beastId: beastId,
        location: '山林'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    // 显示捕获结果
    if (captureResponse.data.success) {
      console.log(`捕获成功: ${captureResponse.data.message}`);
      console.log(`获得经验: ${captureResponse.data.expGained}`);
    } else {
      console.log(`捕获失败: ${captureResponse.data.message}`);
      console.log(`捕获率: ${captureResponse.data.captureRate}`);
    }
    
    // 获取玩家灵兽列表
    console.log('\n3. 获取玩家灵兽列表:');
    const myBeastsResponse = await axios.get(
      `${BASE_URL}/beasts/mybeasts`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (myBeastsResponse.data.data.length === 0) {
      console.log('玩家没有灵兽');
      return;
    }
    
    console.log(`获取成功，共有 ${myBeastsResponse.data.count} 只灵兽`);
    
    // 选择第一只灵兽进行操作
    const playerBeast = myBeastsResponse.data.data[0];
    const playerBeastId = playerBeast._id;
    
    // 训练灵兽
    console.log(`\n4. 训练灵兽 (${playerBeast.nickname}):`);
    const trainResponse = await axios.post(
      `${BASE_URL}/beasts/train`,
      {
        playerBeastId: playerBeastId,
        trainingType: 'attack'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log(`训练结果: ${trainResponse.data.message}`);
    console.log(`属性提升: 攻击力 +${trainResponse.data.data.statGain}`);
    
    // 喂养灵兽
    console.log(`\n5. 喂养灵兽 (${playerBeast.nickname}):`);
    const feedResponse = await axios.post(
      `${BASE_URL}/beasts/feed`,
      {
        playerBeastId: playerBeastId,
        food: 'premium_food'
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log(`喂养结果: ${feedResponse.data.message}`);
    console.log(`忠诚度提升: +${feedResponse.data.data.loyaltyGained}`);
    console.log(`当前忠诚度: ${feedResponse.data.data.loyalty}`);
    
    // 部署灵兽
    console.log(`\n6. 部署灵兽 (${playerBeast.nickname}):`);
    const deployResponse = await axios.post(
      `${BASE_URL}/beasts/deploy`,
      {
        playerBeastId: playerBeastId,
        position: 1
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log(`部署结果: ${deployResponse.data.message}`);
    
    // 获取已部署灵兽
    console.log('\n7. 获取已部署灵兽:');
    const deployedResponse = await axios.get(
      `${BASE_URL}/beasts/deployed`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log(`获取成功，共有 ${deployedResponse.data.count} 只已部署灵兽`);
    
    // 取消部署灵兽
    console.log(`\n8. 取消部署灵兽 (${playerBeast.nickname}):`);
    const undeployResponse = await axios.delete(
      `${BASE_URL}/beasts/undeploy/${playerBeastId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    console.log(`取消部署结果: ${undeployResponse.data.message}`);
    
    console.log('\n灵兽系统测试完成，功能正常！');
  } catch (error) {
    console.error('灵兽系统测试失败:', error.response ? error.response.data : error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('开始测试《纵横天下》游戏后端API...\n');
  
  // 按顺序执行测试
  const registerSuccess = await testRegister();
  if (!registerSuccess) {
    console.log('注册失败，尝试直接登录...');
  }
  
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log('登录失败，无法继续测试需要认证的API');
    return;
  }
  
  await testGetCharacter();
  await testUpdateCharacter();
  
  // 尝试创建测试任务
  await createTestTask();
  
  await testGetAllTasks();
  await testCompleteTask();
  
  // 测试修炼系统
  await testCultivationSystem();
  
  // 测试灵兽系统
  await testBeastSystem();
  
  console.log('\n测试完成！');
}

// 执行测试
runAllTests(); 