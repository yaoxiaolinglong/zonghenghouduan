/**
 * 数据初始化工具
 * Data Initialization Utility
 * 
 * 用于初始化各系统的基础数据
 * Used to initialize base data for all systems
 */

const Realm = require('../models/Realm');
const Artifact = require('../models/Artifact');
const Pill = require('../models/Pill');
const Beast = require('../models/Beast');

// 境界系统初始化数据
const initializeRealms = async () => {
  try {
    // 检查是否已经有境界数据
    const realmCount = await Realm.countDocuments();
    
    if (realmCount === 0) {
      console.log('正在初始化境界数据...');
      
      // 预设境界数据
      const defaultRealms = [
        {
          realmId: 'realm_001',
          name: '练气期',
          level: 1,
          description: '修行的开始，开始感知天地灵气',
          requirements: {
            playerLevel: 1,
            spirit: 10,
            intelligence: 10
          },
          bonuses: {
            spiritMultiplier: 1.0,
            strengthMultiplier: 1.0,
            agilityMultiplier: 1.0,
            intelligenceMultiplier: 1.0,
            cultivationSpeed: 1.0
          },
          abilities: [
            {
              name: '感知灵气',
              description: '能够感知周围的灵气浓度',
              effect: { sensing: 1 }
            }
          ],
          nextRealm: 'realm_002'
        },
        {
          realmId: 'realm_002',
          name: '筑基期',
          level: 2,
          description: '修行者体内开始形成灵力基础',
          requirements: {
            playerLevel: 10,
            spirit: 50,
            intelligence: 40
          },
          bonuses: {
            spiritMultiplier: 1.2,
            strengthMultiplier: 1.1,
            agilityMultiplier: 1.1,
            intelligenceMultiplier: 1.2,
            cultivationSpeed: 1.2
          },
          abilities: [
            {
              name: '引灵入体',
              description: '能够将外界灵气引入体内',
              effect: { spiritRegen: 1.2 }
            }
          ],
          nextRealm: 'realm_003'
        }
      ];
      
      await Realm.insertMany(defaultRealms);
      console.log('境界数据初始化完成');
    } else {
      console.log('境界数据已存在，跳过初始化');
    }
  } catch (err) {
    console.error('境界数据初始化失败:', err);
  }
};

// 法宝系统初始化数据
const initializeArtifacts = async () => {
  try {
    // 检查是否已经有法宝数据
    const artifactCount = await Artifact.countDocuments();
    
    if (artifactCount === 0) {
      console.log('正在初始化法宝数据...');
      
      // 预设法宝数据
      const defaultArtifacts = [
        {
          artifactId: 'artifact_001',
          name: '青锋剑',
          description: '一把普通的青锋剑，锋利无比',
          type: 'weapon',
          rarity: 'common',
          level: 1,
          realmRequired: 'realm_001',
          attributes: {
            attack: 10,
            speed: 5
          }
        },
        {
          artifactId: 'artifact_002',
          name: '玄铁护甲',
          description: '由玄铁打造的护甲，坚固耐用',
          type: 'armor',
          rarity: 'common',
          level: 1,
          realmRequired: 'realm_001',
          attributes: {
            defense: 15,
            health: 20
          }
        }
      ];
      
      await Artifact.insertMany(defaultArtifacts);
      console.log('法宝数据初始化完成');
    } else {
      console.log('法宝数据已存在，跳过初始化');
    }
  } catch (err) {
    console.error('法宝数据初始化失败:', err);
  }
};

// 丹药系统初始化数据
const initializePills = async () => {
  try {
    // 检查是否已经有丹药数据
    const pillCount = await Pill.countDocuments();
    
    if (pillCount === 0) {
      console.log('正在初始化丹药数据...');
      
      // 预设丹药数据
      const defaultPills = [
        {
          pillId: 'pill_001',
          name: '聚气丹',
          description: '初级丹药，有助于聚集灵气，提升修炼效率',
          rarity: 'common',
          type: 'cultivation',
          effects: {
            cultivationBoost: 0.1,
            duration: 60
          },
          price: 100
        },
        {
          pillId: 'pill_002',
          name: '回春丹',
          description: '初级丹药，具有治疗效果',
          rarity: 'common',
          type: 'healing',
          effects: {
            healingAmount: 50,
            duration: 0
          },
          price: 150
        }
      ];
      
      await Pill.insertMany(defaultPills);
      console.log('丹药数据初始化完成');
    } else {
      console.log('丹药数据已存在，跳过初始化');
    }
  } catch (err) {
    console.error('丹药数据初始化失败:', err);
  }
};

// 导出初始化函数
module.exports = {
  initializeRealms,
  initializeArtifacts,
  initializePills
}; 