/**
 * 公共API测试脚本
 * Public API Test Script
 * 
 * 测试不需要认证的公共API
 * Tests the public APIs that don't require authentication
 */

const axios = require('axios');
const colors = require('colors');

const API_URL = 'http://localhost:5000/api';

// 测试结果记录
const testResults = {
  core: { total: 0, passed: 0 },
  beastEquipment: { total: 0, passed: 0 },
  beastSkill: { total: 0, passed: 0 },
  secretRealm: { total: 0, passed: 0 },
  beast: { total: 0, passed: 0 }
};

/**
 * 执行测试并显示结果
 */
const runTest = async (testName, testFn, system) => {
  try {
    console.log(`\n${colors.cyan('开始测试:')} ${colors.white(testName)}`);
    testResults[system].total++;
    
    const result = await testFn();
    if (result) {
      console.log(`${colors.green('✓ 测试通过:')} ${colors.white(testName)}`);
      testResults[system].passed++;
    } else {
      console.log(`${colors.red('✗ 测试失败:')} ${colors.white(testName)}`);
    }
  } catch (error) {
    console.log(`${colors.red('✗ 测试出错:')} ${colors.white(testName)}`);
    console.error(colors.red(`  错误: ${error.message}`));
    if (error.response) {
      console.error(colors.red(`  状态码: ${error.response.status}`));
      console.error(colors.red(`  响应数据: ${JSON.stringify(error.response.data)}`));
    }
  }
};

/**
 * 测试核心API
 */
const testCoreAPI = async () => {
  // 测试服务器状态
  await runTest('服务器状态', async () => {
    const response = await axios.get(`${API_URL}/test`);
    return response.data && response.data.message;
  }, 'core');
  
  // 测试境界系统
  await runTest('境界系统', async () => {
    const response = await axios.get(`${API_URL}/realms`);
    return Array.isArray(response.data) && response.data.length > 0;
  }, 'core');
};

/**
 * 测试灵兽系统的公共API
 */
const testBeastSystem = async () => {
  // 测试灵兽系统路由
  await runTest('灵兽系统路由', async () => {
    const response = await axios.get(`${API_URL}/beasts/test`);
    return response.data && response.data.success;
  }, 'beast');
  
  // 测试获取所有灵兽
  await runTest('获取所有灵兽', async () => {
    const response = await axios.get(`${API_URL}/beasts/beasts`);
    return response.data && response.data.success && response.data.data.length > 0;
  }, 'beast');
  
  // 测试获取灵兽详情
  await runTest('获取灵兽详情', async () => {
    const allBeasts = await axios.get(`${API_URL}/beasts/beasts`);
    if (!allBeasts.data || !allBeasts.data.success || !allBeasts.data.data.length) {
      return false;
    }
    
    const beastId = allBeasts.data.data[0].beastId;
    const response = await axios.get(`${API_URL}/beasts/beasts/${beastId}`);
    return response.data && response.data.success;
  }, 'beast');
};

/**
 * 测试灵兽装备系统的公共API
 */
const testBeastEquipmentSystem = async () => {
  // 测试灵兽装备系统路由
  await runTest('灵兽装备系统路由', async () => {
    const response = await axios.get(`${API_URL}/beast-equipment/test`);
    return response.data && response.data.success;
  }, 'beastEquipment');
  
  // 测试获取所有装备
  await runTest('获取所有灵兽装备', async () => {
    const response = await axios.get(`${API_URL}/beast-equipment/equipment`);
    return response.data && response.data.success && response.data.data.length > 0;
  }, 'beastEquipment');
  
  // 测试获取装备详情
  await runTest('获取灵兽装备详情', async () => {
    const allEquipment = await axios.get(`${API_URL}/beast-equipment/equipment`);
    if (!allEquipment.data || !allEquipment.data.success || !allEquipment.data.data.length) {
      return false;
    }
    
    const equipmentId = allEquipment.data.data[0].equipmentId;
    const response = await axios.get(`${API_URL}/beast-equipment/equipment/${equipmentId}`);
    return response.data && response.data.success;
  }, 'beastEquipment');
};

/**
 * 测试灵兽技能系统的公共API
 */
const testBeastSkillSystem = async () => {
  // 测试灵兽技能系统路由
  await runTest('灵兽技能系统路由', async () => {
    const response = await axios.get(`${API_URL}/beast-skills/test`);
    return response.data && response.data.success;
  }, 'beastSkill');
  
  // 测试获取所有技能
  await runTest('获取所有灵兽技能', async () => {
    const response = await axios.get(`${API_URL}/beast-skills/skills`);
    return response.data && response.data.success && response.data.data.length > 0;
  }, 'beastSkill');
  
  // 测试获取技能详情
  await runTest('获取灵兽技能详情', async () => {
    const allSkills = await axios.get(`${API_URL}/beast-skills/skills`);
    if (!allSkills.data || !allSkills.data.success || !allSkills.data.data.length) {
      return false;
    }
    
    const skillId = allSkills.data.data[0].skillId;
    const response = await axios.get(`${API_URL}/beast-skills/skills/${skillId}`);
    return response.data && response.data.success;
  }, 'beastSkill');
};

/**
 * 测试秘境系统的公共API
 */
const testSecretRealmSystem = async () => {
  // 测试秘境系统路由
  await runTest('秘境系统路由', async () => {
    const response = await axios.get(`${API_URL}/secret-realms/test`);
    return response.data && response.data.success;
  }, 'secretRealm');
  
  // 测试获取所有秘境
  await runTest('获取所有秘境', async () => {
    const response = await axios.get(`${API_URL}/secret-realms/realms`);
    return response.data && response.data.success;
  }, 'secretRealm');
  
  // 测试秘境详情
  await runTest('获取秘境详情 (如果有数据)', async () => {
    const allRealms = await axios.get(`${API_URL}/secret-realms/realms`);
    
    if (!allRealms.data || !allRealms.data.success || !allRealms.data.data || !allRealms.data.data.length) {
      console.log(colors.yellow('没有秘境数据，跳过秘境详情测试'));
      return true; // 没有数据也视为通过
    }
    
    const realmId = allRealms.data.data[0].realmId;
    const response = await axios.get(`${API_URL}/secret-realms/realms/${realmId}`);
    return response.data && response.data.success;
  }, 'secretRealm');
};

/**
 * 显示测试结果统计
 */
const showTestResults = () => {
  console.log('\n' + colors.cyan.bold('=== 测试结果统计 ==='));
  
  Object.entries(testResults).forEach(([system, result]) => {
    const passRate = result.total > 0 ? Math.round((result.passed / result.total) * 100) : 0;
    let color = colors.green;
    
    if (passRate < 50) color = colors.red;
    else if (passRate < 80) color = colors.yellow;
    
    console.log(color(`${system} 系统: ${result.passed}/${result.total} 通过 (${passRate}%)`));
  });
  
  const totalTests = Object.values(testResults).reduce((acc, curr) => acc + curr.total, 0);
  const passedTests = Object.values(testResults).reduce((acc, curr) => acc + curr.passed, 0);
  const totalPassRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
  
  console.log(colors.cyan.bold(`\n总计: ${passedTests}/${totalTests} 通过 (${totalPassRate}%)`));
};

/**
 * 主测试函数
 */
const runAllTests = async () => {
  console.log(colors.yellow.bold('=== 《纵横天下》公共API测试开始 ==='));
  
  // 测试核心API
  console.log(colors.yellow.bold('\n=== 核心API测试 ==='));
  await testCoreAPI();
  
  // 测试灵兽系统
  console.log(colors.yellow.bold('\n=== 灵兽系统测试 ==='));
  await testBeastSystem();
  
  // 测试灵兽装备系统
  console.log(colors.yellow.bold('\n=== 灵兽装备系统测试 ==='));
  await testBeastEquipmentSystem();
  
  // 测试灵兽技能系统
  console.log(colors.yellow.bold('\n=== 灵兽技能系统测试 ==='));
  await testBeastSkillSystem();
  
  // 测试秘境系统
  console.log(colors.yellow.bold('\n=== 秘境系统测试 ==='));
  await testSecretRealmSystem();
  
  // 显示测试结果
  showTestResults();
  console.log(colors.yellow.bold('\n=== 测试结束 ==='));
};

// 执行所有测试
runAllTests().catch(error => {
  console.error(colors.red.bold('测试过程中发生错误:'), error.message);
}); 