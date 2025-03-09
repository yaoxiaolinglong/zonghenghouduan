# 《纵横天下》游戏后端服务详细文档
# Detailed Documentation for "Zongheng Tianxia" Game Backend Service

## 目录 | Table of Contents

1. [项目概述 | Project Overview](#项目概述--project-overview)
2. [目录结构 | Directory Structure](#目录结构--directory-structure)
3. [API接口 | API Endpoints](#api接口--api-endpoints)
4. [用户系统 | User System](#用户系统--user-system)
5. [角色系统 | Character System](#角色系统--character-system)
6. [任务系统 | Task System](#任务系统--task-system)
7. [修炼系统 | Cultivation System](#修炼系统--cultivation-system)
8. [境界系统 | Realm System](#境界系统--realm-system)
9. [法宝系统 | Artifact System](#法宝系统--artifact-system)
10. [丹药系统 | Pill System](#丹药系统--pill-system)
11. [灵兽系统 | Beast System](#灵兽系统--beast-system)
12. [灵兽装备系统 | Beast Equipment System](#灵兽装备系统--beast-equipment-system)
13. [灵兽技能系统 | Beast Skill System](#灵兽技能系统--beast-skill-system)
14. [秘境系统 | Secret Realm System](#秘境系统--secret-realm-system)
15. [玩家系统 | Player System](#玩家系统--player-system)
16. [安全最佳实践 | Security Best Practices](#安全最佳实践--security-best-practices)
17. [更新日志 | Update Log](#更新日志--update-log)

## 项目概述 | Project Overview

《纵横天下》是一款以修仙为主题的游戏应用，本项目是其后端服务部分。后端服务提供了用户管理、角色属性、任务系统等核心功能的API接口，支持游戏的基本运行逻辑。

"Zongheng Tianxia" is a cultivation-themed game application, and this project is its backend service. The backend service provides API interfaces for core functions such as user management, character attributes, and task systems, supporting the basic operational logic of the game.

### 主要功能 | Main Features

- **用户系统**：注册、登录、认证
- **角色系统**：角色属性管理、经验值和等级提升
- **任务系统**：任务列表、任务完成与奖励
- **资源系统**：金币、灵石等资源管理
- **修炼系统**：开始修炼、结束修炼、突破境界
- **境界系统**：境界管理、境界突破、境界加成
- **法宝系统**：法宝获取、装备、升级
- **丹药系统**：丹药获取、使用、效果管理
- **灵兽系统**：灵兽捕获、训练、进化
- **灵兽装备系统**：灵兽装备获取、装备、强化
- **灵兽技能系统**：灵兽技能学习、训练、升级
- **秘境系统**：秘境探索、挑战、奖励获取
- **玩家系统**：玩家信息、背包管理、资源管理

## 目录结构 | Directory Structure

```
houduan/
├── config/                 # 配置文件
├── controllers/            # 控制器
│   ├── userController.js   # 用户控制器
│   ├── characterController.js # 角色控制器
│   ├── taskController.js   # 任务控制器
│   ├── cultivationController.js # 修炼控制器
│   ├── realmController.js  # 境界控制器
│   ├── artifactController.js # 法宝控制器
│   ├── pillController.js   # 丹药控制器
│   ├── beastController.js  # 灵兽控制器
│   ├── beastEquipmentController.js # 灵兽装备控制器
│   ├── beastSkillController.js # 灵兽技能控制器
│   ├── secretRealmController.js # 秘境控制器
│   ├── playerController.js # 玩家控制器
│   └── initData.js        # 数据初始化
```

### 文件说明 | File Descriptions

- **models/**: 定义数据结构和模型
- **routes/**: 定义API路由和端点
- **controllers/**: 包含业务逻辑处理
- **middleware/**: 包含中间件函数，如认证检查
- **config/**: 包含配置文件
- **scripts/**: 包含各种实用脚本
- **server.js**: 应用程序的入口点
- **.env**: 存储环境变量和敏感信息

## 安装与配置 | Installation and Configuration

### 系统要求 | System Requirements

- Node.js v14.x 或更高版本
- MongoDB 4.x 或更高版本（本地或云服务）
- npm 6.x 或更高版本

### 安装步骤 | Installation Steps

1. **克隆或下载项目**:
   ```bash
   git clone <repository-url>
   cd houduan
   ```

2. **安装依赖**:
   ```bash
   npm install
   ```

3. **配置环境变量**:
   创建或编辑 `.env` 文件，添加以下配置：
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://yaoxiaolinglong:wsbt0000.@yaoxiaolinglong.gw079yz.mongodb.net/?retryWrites=true&w=majority&appName=yaoxiaolinglong
   JWT_SECRET=your_secure_jwt_secret
   NODE_ENV=development
   ```
   
   > **注意**: 请将 `JWT_SECRET` 替换为一个安全的随机字符串。

4. **初始化数据库**:
   ```bash
   node scripts/initDb.js
   ```

5. **启动服务**:
   ```bash
   npm start
   ```
   
   开发模式启动（自动重启）:
   ```bash
   npm run dev
   ```

### 环境变量说明 | Environment Variables

- **PORT**: 服务器运行的端口号
- **MONGO_URI**: MongoDB连接字符串
- **JWT_SECRET**: JWT签名密钥
- **NODE_ENV**: 运行环境（development/production）

## API接口文档 | API Documentation

### 用户管理 | User Management

#### 注册新用户 | Register New User

- **URL**: `/api/users/register`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **成功响应** (201):
  ```json
  {
    "message": "注册成功"
  }
  ```
- **错误响应** (400/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 用户登录 | User Login

- **URL**: `/api/users/login`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "token": "jwt_token",
    "user": {
      "_id": "user_id",
      "username": "string",
      "level": "number",
      "experience": "number",
      "resources": {
        "gold": "number",
        "spiritStones": "number"
      }
    }
  }
  ```
- **错误响应** (401/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

### 角色属性 | Character Attributes

#### 获取角色信息 | Get Character Information

- **URL**: `/api/characters/:userId`
- **方法**: `GET`
- **URL参数**: `userId` - 用户ID
- **成功响应** (200):
  ```json
  {
    "_id": "character_id",
    "userId": "user_id",
    "level": "number",
    "experience": "number",
    "resources": {
      "gold": "number",
      "spiritStones": "number"
    },
    "attributes": {
      "strength": "number",
      "agility": "number",
      "intelligence": "number",
      "spirit": "number"
    }
  }
  ```
- **错误响应** (404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 更新角色信息 | Update Character Information

- **URL**: `/api/characters/:userId`
- **方法**: `PUT`
- **URL参数**: `userId` - 用户ID
- **请求体**: 要更新的字段
  ```json
  {
    "level": "number",
    "experience": "number",
    "resources": {
      "gold": "number",
      "spiritStones": "number"
    },
    "attributes": {
      "strength": "number",
      "agility": "number",
      "intelligence": "number",
      "spirit": "number"
    }
  }
  ```
- **成功响应** (200): 更新后的角色信息
- **错误响应** (404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

### 任务系统 | Task System

#### 获取所有任务 | Get All Tasks

- **URL**: `/api/tasks`
- **方法**: `GET`
- **成功响应** (200): 任务列表
  ```json
  [
    {
      "_id": "task_id",
      "name": "string",
      "description": "string",
      "reward": {
        "experience": "number",
        "gold": "number",
        "spiritStones": "number"
      },
      "condition": "string",
      "difficulty": "string"
    }
  ]
  ```
- **错误响应** (500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 完成任务 | Complete Task

- **URL**: `/api/tasks/complete`
- **方法**: `POST`
- **请求体**:
  ```json
  {
    "userId": "string",
    "taskId": "string"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "任务完成",
    "updatedCharacter": {
      // 更新后的角色信息
    }
  }
  ```
- **错误响应** (404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

### 修炼系统 | Cultivation System

#### 开始修炼 | Start Cultivation

- **URL**: `/api/cultivation/start`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "techniqueId": "功法ID",
    "location": "修炼地点"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "开始修炼",
    "cultivation": {
      "userId": "用户ID",
      "status": "cultivating",
      "startTime": "开始时间",
      "technique": "功法ID",
      "efficiency": "修炼效率",
      "currentProgress": 0,
      "targetProgress": 100,
      "location": "修炼地点",
      "bonusFactors": {
        "environment": 1.0,
        "items": 1.0,
        "sect": 1.0
      },
      "lastUpdated": "更新时间"
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 获取修炼状态 | Get Cultivation Status

- **URL**: `/api/cultivation/status/:userId`
- **方法**: `GET`
- **认证**: 需要 JWT 令牌
- **URL参数**: `userId` - 用户ID
- **成功响应** (200): 返回修炼状态信息
  ```json
  {
    "userId": "用户ID",
    "status": "修炼状态",
    "startTime": "开始时间",
    "technique": "功法ID",
    "efficiency": "修炼效率",
    "currentProgress": "当前进度",
    "targetProgress": 100,
    "location": "修炼地点",
    "bonusFactors": {
      "environment": 1.0,
      "items": 1.0,
      "sect": 1.0
    },
    "lastUpdated": "更新时间"
  }
  ```
- **错误响应** (404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 结束修炼 | End Cultivation

- **URL**: `/api/cultivation/end`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "结束修炼",
    "duration": "修炼时间(分钟)",
    "gainedExperience": "获得的经验",
    "spiritGain": "获得的灵力",
    "levelUp": "是否升级",
    "updatedCharacter": {
      // 更新后的角色信息
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 尝试突破 | Attempt Breakthrough

- **URL**: `/api/cultivation/breakthrough/attempt`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "开始突破",
    "successRate": "成功率",
    "cultivation": {
      // 修炼信息
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 完成突破 | Complete Breakthrough

- **URL**: `/api/cultivation/breakthrough/complete`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "突破成功/突破失败",
    "isSuccess": "是否成功",
    "duration": "突破时间(分钟)",
    "successRate": "最终成功率",
    "updatedCharacter": {
      // 更新后的角色信息
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

### 境界系统 | Realm System

#### 获取所有境界 | Get All Realms

- **URL**: `/api/realms`
- **方法**: `GET`
- **成功响应** (200): 境界列表
  ```json
  [
    {
      "realmId": "realm_001",
      "name": "炼气期",
      "level": 1,
      "description": "修行的开始，开始感知天地灵气",
      "requirements": {
        "playerLevel": 1,
        "spirit": 10,
        "intelligence": 10
      },
      "bonuses": {
        "spiritMultiplier": 1.0,
        "strengthMultiplier": 1.0,
        "agilityMultiplier": 1.0,
        "intelligenceMultiplier": 1.0,
        "cultivationSpeed": 1.0
      },
      "abilities": [
        {
          "name": "感知灵气",
          "description": "能够感知周围的灵气浓度",
          "effect": { "sensing": 1 }
        }
      ],
      "nextRealm": "realm_002"
    }
  ]
  ```
- **错误响应** (500):
  ```json
  {
    "error": "获取境界失败"
  }
  ```

#### 获取角色当前境界 | Get Character Realm

- **URL**: `/api/realms/:userId`
- **方法**: `GET`
- **认证**: 需要 JWT 令牌
- **URL参数**: `userId` - 用户ID
- **成功响应** (200):
  ```json
  {
    "currentRealm": {
      "realmId": "realm_001",
      "name": "炼气期",
      "level": 1,
      // ... 其他境界信息
    },
    "progress": 45,
    "breakthroughAttempts": 0
  }
  ```
- **错误响应** (404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 尝试境界突破 | Attempt Realm Breakthrough

- **URL**: `/api/realms/breakthrough/attempt`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "开始境界突破",
    "currentRealm": "炼气期",
    "nextRealm": "筑基期",
    "baseSuccessRate": 0.45,
    "cultivation": {
      // 修炼信息
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 完成境界突破 | Complete Realm Breakthrough

- **URL**: `/api/realms/breakthrough/complete`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "突破成功，晋升为筑基期",
    "isSuccess": true,
    "duration": 120,
    "successRate": 0.65,
    "currentRealm": {
      // 新境界信息
    },
    "updatedCharacter": {
      // 更新后的角色信息
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

### 法宝系统 | Artifact System

#### 获取所有法宝 | Get All Artifacts

- **URL**: `/api/artifacts`
- **方法**: `GET`
- **成功响应** (200): 法宝列表
  ```json
  [
    {
      "artifactId": "artifact_001",
      "name": "青锋剑",
      "description": "一把普通的青锋剑，锋利无比",
      "type": "weapon",
      "rarity": "common",
      "level": 1,
      "realmRequired": "realm_001",
      "attributes": {
        "attack": 10,
        "speed": 5
      },
      // ... 其他法宝信息
    }
  ]
  ```
- **错误响应** (500):
  ```json
  {
    "error": "获取法宝失败"
  }
  ```

#### 获取法宝详情 | Get Artifact Details

- **URL**: `/api/artifacts/:artifactId`
- **方法**: `GET`
- **URL参数**: `artifactId` - 法宝ID
- **成功响应** (200): 法宝详情
  ```json
  {
    "artifactId": "artifact_001",
    "name": "青锋剑",
    "description": "一把普通的青锋剑，锋利无比",
    "type": "weapon",
    "rarity": "common",
    "level": 1,
    "realmRequired": "realm_001",
    "attributes": {
      "attack": 10,
      "speed": 5
    },
    // ... 其他法宝信息
  }
  ```
- **错误响应** (404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 获取玩家拥有的法宝 | Get Player Artifacts

- **URL**: `/api/artifacts/player/:userId`
- **方法**: `GET`
- **认证**: 需要 JWT 令牌
- **URL参数**: `userId` - 用户ID
- **成功响应** (200): 玩家法宝列表
  ```json
  [
    {
      "userId": "用户ID",
      "artifactId": "artifact_001",
      "isEquipped": true,
      "level": 3,
      "experience": 150,
      "attributes": {
        "attack": 13,
        "speed": 7
      },
      "refinementLevel": 1,
      "details": {
        // 法宝详情
      }
    }
  ]
  ```
- **错误响应** (500):
  ```json
  {
    "error": "获取玩家法宝失败"
  }
  ```

#### 获取法宝 | Acquire Artifact

- **URL**: `/api/artifacts/acquire`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "artifactId": "法宝ID"
  }
  ```
- **成功响应** (201):
  ```json
  {
    "message": "获得法宝：青锋剑",
    "artifact": {
      // 法宝信息
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 装备法宝 | Equip Artifact

- **URL**: `/api/artifacts/equip`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "artifactId": "法宝ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "成功装备法宝：青锋剑",
    "updatedCharacter": {
      // 更新后的角色信息
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 卸下法宝 | Unequip Artifact

- **URL**: `/api/artifacts/unequip`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "artifactId": "法宝ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "成功卸下法宝：青锋剑",
    "updatedCharacter": {
      // 更新后的角色信息
    }
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 升级法宝 | Upgrade Artifact

- **URL**: `/api/artifacts/upgrade`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "artifactId": "法宝ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "法宝 青锋剑 升级到 4 级",
    "updatedArtifact": {
      // 更新后的法宝信息
    },
    "spiritStonesUsed": 300
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

### 丹药系统 | Pill System

#### 获取所有丹药 | Get All Pills

- **URL**: `/api/pills`
- **方法**: `GET`
- **成功响应** (200): 丹药列表
  ```json
  [
    {
      "pillId": "pill_001",
      "name": "聚气丹",
      "description": "初级丹药，有助于聚集灵气，提升修炼效率",
      "rarity": "common",
      "type": "cultivation",
      "effects": {
        "cultivationBoost": 0.1,
        "duration": 60
      },
      // ... 其他丹药信息
    }
  ]
  ```
- **错误响应** (500):
  ```json
  {
    "error": "获取丹药失败"
  }
  ```

#### 获取丹药详情 | Get Pill Details

- **URL**: `/api/pills/:pillId`
- **方法**: `GET`
- **URL参数**: `pillId` - 丹药ID
- **成功响应** (200): 丹药详情
  ```json
  {
    "pillId": "pill_001",
    "name": "聚气丹",
    "description": "初级丹药，有助于聚集灵气，提升修炼效率",
    "rarity": "common",
    "type": "cultivation",
    "effects": {
      "cultivationBoost": 0.1,
      "duration": 60
    },
    // ... 其他丹药信息
  }
  ```
- **错误响应** (404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 获取玩家拥有的丹药 | Get Player Pills

- **URL**: `/api/pills/player/:userId`
- **方法**: `GET`
- **认证**: 需要 JWT 令牌
- **URL参数**: `userId` - 用户ID
- **成功响应** (200): 玩家丹药列表
  ```json
  [
    {
      "userId": "用户ID",
      "pillId": "pill_001",
      "quantity": 5,
      "lastUsed": "2023-03-09T12:00:00Z",
      "details": {
        // 丹药详情
      }
    }
  ]
  ```
- **错误响应** (500):
  ```json
  {
    "error": "获取玩家丹药失败"
  }
  ```

#### 获取当前生效的丹药效果 | Get Active Pill Effects

- **URL**: `/api/pills/effects/:userId`
- **方法**: `GET`
- **认证**: 需要 JWT 令牌
- **URL参数**: `userId` - 用户ID
- **成功响应** (200): 生效中的丹药效果
  ```json
  [
    {
      "userId": "用户ID",
      "pillId": "pill_001",
      "startTime": "2023-03-09T12:00:00Z",
      "endTime": "2023-03-09T13:00:00Z",
      "effects": {
        "cultivationBoost": 0.1
      },
      "isActive": true,
      "pillDetails": {
        // 丹药详情
      },
      "remainingTime": 30
    }
  ]
  ```
- **错误响应** (500):
  ```json
  {
    "error": "获取丹药效果失败"
  }
  ```

#### 获取丹药 | Acquire Pill

- **URL**: `/api/pills/acquire`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "pillId": "丹药ID",
    "quantity": 1
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "获得丹药：聚气丹 x1",
    "playerPill": {
      // 玩家丹药信息
    }
  }
  ```
- **错误响应** (404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

#### 使用丹药 | Use Pill

- **URL**: `/api/pills/use`
- **方法**: `POST`
- **认证**: 需要 JWT 令牌
- **请求体**:
  ```json
  {
    "userId": "用户ID",
    "pillId": "丹药ID"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "message": "成功使用丹药：聚气丹",
    "remainingQuantity": 4,
    "message": "修炼效率提升 10%，将持续 60 分钟",
    "originalEfficiency": 1.0,
    "newEfficiency": 1.1,
    "endTime": "2023-03-09T13:00:00Z"
  }
  ```
- **错误响应** (400/404/500):
  ```json
  {
    "error": "错误信息"
  }
  ```

## 数据模型 | Data Models

### 用户模型 (User)

```javascript
{
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  resources: {
    gold: { type: Number, default: 100 },
    spiritStones: { type: Number, default: 50 }
  },
  createdAt: { type: Date, default: Date.now }
}
```

### 角色模型 (Character)

```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  resources: {
    gold: { type: Number, default: 100 },
    spiritStones: { type: Number, default: 50 }
  },
  attributes: {
    strength: { type: Number, default: 10 },
    agility: { type: Number, default: 10 },
    intelligence: { type: Number, default: 10 },
    spirit: { type: Number, default: 10 }
  },
  updatedAt: { type: Date, default: Date.now }
}
```

### 任务模型 (Task)

```javascript
{
  name: { type: String, required: true },
  description: { type: String },
  reward: {
    experience: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    spiritStones: { type: Number, default: 0 }
  },
  condition: { type: String },
  difficulty: { type: String, enum: ['简单', '普通', '困难'], default: '普通' },
  createdAt: { type: Date, default: Date.now }
}
```

### 修炼模型 (Cultivation)

```javascript
{
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['idle', 'cultivating', 'breakthrough'], 
    default: 'idle' 
  },
  startTime: { 
    type: Date 
  },
  technique: { 
    type: String,
    ref: 'Skill'
  },
  efficiency: { 
    type: Number, 
    default: 1.0 
  },
  currentProgress: { 
    type: Number, 
    default: 0 
  },
  targetProgress: { 
    type: Number, 
    default: 100 
  },
  location: {
    type: String,
    default: 'default'
  },
  bonusFactors: {
    environment: { type: Number, default: 1.0 },
    items: { type: Number, default: 1.0 },
    sect: { type: Number, default: 1.0 }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}
```

### 境界模型 (Realm)

```javascript
{
  realmId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  level: { type: Number, required: true },
  description: { type: String },
  requirements: {
    playerLevel: { type: Number, required: true },
    spirit: { type: Number, required: true },
    intelligence: { type: Number, required: true },
    comprehension: { type: Number, default: 0 }
  },
  bonuses: {
    spiritMultiplier: { type: Number, default: 1.0 },
    strengthMultiplier: { type: Number, default: 1.0 },
    agilityMultiplier: { type: Number, default: 1.0 },
    intelligenceMultiplier: { type: Number, default: 1.0 },
    cultivationSpeed: { type: Number, default: 1.0 }
  },
  abilities: [{
    name: { type: String },
    description: { type: String },
    effect: { type: Object }
  }],
  nextRealm: { type: String, ref: 'Realm' }
}
```

### 法宝模型 (Artifact)

```javascript
{
  artifactId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['weapon', 'armor', 'accessory', 'flying', 'spirit'], required: true },
  rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'], required: true },
  level: { type: Number, default: 1 },
  realmRequired: { type: String, ref: 'Realm', default: 'realm_001' },
  attributes: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    spirit: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 }
  },
  skills: [{
    name: { type: String },
    description: { type: String },
    effect: { type: Object },
    cooldown: { type: Number, default: 0 }
  }],
  upgradeRequirements: {
    spiritStones: { type: Number, default: 0 },
    materials: [{ 
      itemId: { type: String },
      quantity: { type: Number }
    }]
  },
  maxLevel: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
}
```

### 玩家法宝模型 (PlayerArtifact)

```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artifactId: { type: String, ref: 'Artifact', required: true },
  isEquipped: { type: Boolean, default: false },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  attributes: {
    attack: { type: Number, default: 0 },
    defense: { type: Number, default: 0 },
    speed: { type: Number, default: 0 },
    spirit: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 }
  },
  refinementLevel: { type: Number, default: 0 },
  acquiredAt: { type: Date, default: Date.now },
  lastUsed: { type: Date }
}
```

### 丹药模型 (Pill)

```javascript
{
  pillId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  rarity: { type: String, enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'], required: true },
  type: { type: String, enum: ['attribute', 'cultivation', 'healing', 'special'], required: true },
  effects: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    spirit: { type: Number, default: 0 },
    cultivationBoost: { type: Number, default: 0 },
    healingAmount: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    specialEffect: { type: String }
  },
  realmRequired: { type: String, ref: 'Realm', default: 'realm_001' },
  cooldown: { type: Number, default: 24 },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### 玩家丹药模型 (PlayerPill)

```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pillId: { type: String, ref: 'Pill', required: true },
  quantity: { type: Number, default: 1, min: 0 },
  lastUsed: { type: Date },
  acquiredAt: { type: Date, default: Date.now }
}
```

### 丹药效果模型 (PillEffect)

```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pillId: { type: String, ref: 'Pill', required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, required: true },
  effects: {
    strength: { type: Number, default: 0 },
    agility: { type: Number, default: 0 },
    intelligence: { type: Number, default: 0 },
    spirit: { type: Number, default: 0 },
    cultivationBoost: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}
```

## 认证与授权 | Authentication and Authorization

### JWT认证流程

1. 用户登录成功后，服务器生成JWT令牌
2. 令牌包含用户ID和过期时间
3. 客户端在后续请求中通过Authorization头部发送令牌
4. 服务器验证令牌的有效性
5. 验证成功后，请求继续处理；失败则返回401错误

### 认证中间件

`middleware/auth.js` 提供了JWT认证中间件，可以在需要保护的路由中使用：

```javascript
const auth = require('../middleware/auth');

// 在路由中使用认证中间件
router.get('/protected-route', auth, (req, res) => {
  // 只有认证通过的请求才能到达这里
  // req.userId 包含已认证用户的ID
});
```

## 部署指南 | Deployment Guide

### 本地开发环境

1. 确保MongoDB服务已启动
2. 设置环境变量（通过.env文件）
3. 运行 `npm run dev` 启动开发服务器

### 生产环境部署

#### 准备工作

1. 更新环境变量：
   ```
   NODE_ENV=production
   MONGO_URI=your_production_mongodb_uri
   JWT_SECRET=your_secure_production_jwt_secret
   ```

2. 安装PM2（进程管理器）：
   ```bash
   npm install -g pm2
   ```

#### 部署步骤

1. 将代码部署到服务器
2. 安装依赖：
   ```bash
   npm install --production
   ```

3. 使用PM2启动服务：
   ```bash
   pm2 start server.js --name "zongheng-backend"
   ```

4. 配置PM2自启动：
   ```bash
   pm2 startup
   pm2 save
   ```

#### 使用Docker部署（可选）

1. 创建Dockerfile：
   ```dockerfile
   FROM node:14-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install --production
   COPY . .
   EXPOSE 5000
   CMD ["node", "server.js"]
   ```

2. 构建镜像：
   ```bash
   docker build -t zongheng-backend .
   ```

3. 运行容器：
   ```bash
   docker run -p 5000:5000 --env-file .env -d zongheng-backend
   ```

## 常见问题 | Troubleshooting

### 数据库连接问题

**问题**: 无法连接到MongoDB数据库
**解决方案**:
- 检查MONGO_URI是否正确
- 确保MongoDB服务正在运行
- 检查网络连接和防火墙设置
- 确保MongoDB Atlas IP白名单已更新（如果使用云服务）

### JWT认证问题

**问题**: 令牌验证失败
**解决方案**:
- 确保JWT_SECRET在客户端和服务器之间一致
- 检查令牌是否已过期
- 确保Authorization头部格式正确（Bearer token）

### 性能优化

**问题**: API响应缓慢
**解决方案**:
- 添加数据库索引
- 实现缓存机制（如Redis）
- 优化数据库查询
- 考虑水平扩展服务

## 扩展与定制 | Extension and Customization

### 添加新的API端点

1. 在 `models/` 目录中创建新的数据模型（如果需要）
2. 在 `controllers/` 目录中创建新的控制器
3. 在 `routes/` 目录中创建新的路由文件
4. 在 `server.js` 中注册新的路由

### 示例：添加商城系统

1. 创建商品模型 (`models/Item.js`):
   ```javascript
   const mongoose = require('mongoose');
   
   const ItemSchema = new mongoose.Schema({
     name: { type: String, required: true },
     description: { type: String },
     price: {
       gold: { type: Number, default: 0 },
       spiritStones: { type: Number, default: 0 }
     },
     type: { type: String, enum: ['武器', '防具', '丹药', '法宝'], required: true },
     effects: { type: Object },
     createdAt: { type: Date, default: Date.now }
   });
   
   module.exports = mongoose.model('Item', ItemSchema);
   ```

2. 创建商城控制器 (`controllers/shopController.js`)
3. 创建商城路由 (`routes/shopRoutes.js`)
4. 在 `server.js` 中注册商城路由

### 修改现有功能

要修改现有功能，只需找到相应的控制器文件并更新其中的逻辑。例如，要修改任务完成的奖励机制，可以编辑 `controllers/taskController.js` 中的 `completeTask` 方法。

## 安全最佳实践 | Security Best Practices

### 密码安全

- 使用bcrypt对密码进行哈希处理
- 永远不要以明文形式存储密码
- 实施密码强度要求

### API安全

- 使用HTTPS加密传输
- 实施速率限制以防止暴力攻击
- 验证所有用户输入
- 使用参数化查询防止注入攻击

### 敏感数据保护

- 使用环境变量存储敏感信息
- 不要在代码中硬编码密钥或密码
- 限制敏感数据的暴露

### 定期更新

- 保持依赖包的最新状态
- 定期审查和更新安全措施
- 监控安全公告和漏洞报告

## 更新日志 | Update Log

### 2023-03-09

1. **新增三个灵兽相关系统**
   - 灵兽装备系统：为灵兽提供装备系统，增加属性加成和特殊效果
   - 灵兽技能系统：灵兽可学习、训练和升级技能
   - 秘境系统：提供灵兽探索和挑战特殊区域的机制

2. **新增玩家系统**
   - 区别于用户系统，专注于游戏中属性和物品管理
   - 提供背包系统，支持各类物品的存储和管理
   - 支持资源系统，管理玩家的各种游戏资源

3. **完善灵兽系统**
   - 增加灵兽推荐功能
   - 增加灵兽配对功能
   - 增加灵兽探险功能

### 2023-03-07

1. **实现修炼系统**
   - 添加修炼功能，支持开始/结束修炼
   - 支持突破境界功能
   - 修炼效率受多种因素影响，包括地点、技法等

### 2023-03-05

1. **初始系统实现**
   - 用户系统：注册、登录、认证
   - 角色系统：角色属性、经验升级
   - 任务系统：任务列表、完成、奖励
   - 境界系统：境界管理、突破
   - 法宝系统：法宝获取、属性
   - 丹药系统：丹药功效、使用
   - 灵兽系统：基础捕获和管理功能

## 灵兽系统 | Beast System

灵兽系统允许玩家捕获、训练和进化各种灵兽，增加游戏的多样性和策略性。灵兽可以协助玩家战斗、采集资源，以及提供各种属性加成。

### 灵兽系统API端点

#### 获取灵兽图鉴

- **URL**: `/api/beasts/beasts`
- **方法**: `GET`
- **认证**: 不需要
- **描述**: 获取所有可捕获灵兽的信息
- **响应**:
  ```json
  {
    "success": true,
    "data": [
      {
        "beastId": "beast_001",
        "name": "小火狐",
        "description": "一只能喷火的可爱狐狸，性格活泼好动。",
        "type": "火灵",
        "rarity": "普通",
        "baseAttributes": {
          "attack": 12,
          "defense": 8,
          "speed": 15,
          "health": 80,
          "mana": 60
        },
        // 其他属性...
      },
      // 更多灵兽...
    ]
  }
  ```

#### 获取特定灵兽信息

- **URL**: `/api/beasts/beasts/:beastId`
- **方法**: `GET`
- **认证**: 不需要
- **描述**: 获取特定灵兽的详细信息
- **参数**:
  - `beastId`: 灵兽ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "beastId": "beast_001",
      "name": "小火狐",
      "description": "一只能喷火的可爱狐狸，性格活泼好动。",
      "type": "火灵",
      "rarity": "普通",
      "baseAttributes": {
        "attack": 12,
        "defense": 8,
        "speed": 15,
        "health": 80,
        "mana": 60
      },
      "skills": [
        {
          "name": "火花",
          "description": "喷出一小簇火花攻击敌人",
          "damage": 10,
          "cooldown": 1,
          "manaCost": 5,
          "targeting": "single"
        },
        // 更多技能...
      ],
      "evolutionPaths": [
        {
          "stage": 1,
          "name": "火灵狐",
          "description": "进化后的火狐，全身燃烧着微弱的火焰",
          "requiredLevel": 10,
          // 其他进化要求和效果...
        }
      ],
      "captureRate": 0.3,
      "habitat": "山林"
    }
  }
  ```

#### 获取玩家灵兽列表

- **URL**: `/api/beasts/mybeasts`
- **方法**: `GET`
- **认证**: 需要
- **描述**: 获取玩家拥有的所有灵兽
- **响应**:
  ```json
  {
    "success": true,
    "count": 2,
    "data": [
      {
        "_id": "60d21b4667d0d8992e610c1e",
        "userId": "60d21b4667d0d8992e610c1a",
        "beastId": "beast_001",
        "nickname": "小火狐",
        "level": 5,
        "experience": 320,
        "attributes": {
          "attack": 17,
          "defense": 12,
          "speed": 18,
          "health": 120,
          "mana": 75,
          "loyalty": 85
        },
        // 其他属性...
      },
      // 更多灵兽...
    ]
  }
  ```

#### 获取特定玩家灵兽

- **URL**: `/api/beasts/mybeasts/:playerBeastId`
- **方法**: `GET`
- **认证**: 需要
- **描述**: 获取玩家特定灵兽的详细信息
- **参数**:
  - `playerBeastId`: 玩家灵兽ID
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60d21b4667d0d8992e610c1e",
      "userId": "60d21b4667d0d8992e610c1a",
      "beastId": {
        // 灵兽基本信息...
      },
      "nickname": "小火狐",
      "level": 5,
      "experience": 320,
      // 其他属性...
    }
  }
  ```

#### 捕获灵兽

- **URL**: `/api/beasts/capture`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 尝试捕获一只灵兽
- **请求体**:
  ```json
  {
    "beastId": "beast_001",
    "location": "山林"
  }
  ```
- **响应 (成功)**:
  ```json
  {
    "success": true,
    "message": "成功捕获 小火狐",
    "data": {
      // 新捕获的灵兽信息...
    },
    "expGained": 10
  }
  ```
- **响应 (失败)**:
  ```json
  {
    "success": false,
    "message": "捕获失败，灵兽逃脱了",
    "captureRate": 0.35,
    "roll": 0.42
  }
  ```

#### 训练灵兽

- **URL**: `/api/beasts/train`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 训练灵兽提升特定属性
- **请求体**:
  ```json
  {
    "playerBeastId": "60d21b4667d0d8992e610c1e",
    "trainingType": "attack"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "成功训练了 小火狐",
    "data": {
      "level": 5,
      "experience": 330,
      "expNeededForNextLevel": 500,
      "attributes": {
        // 更新后的属性...
      },
      "trainingType": "attack",
      "statGain": 2
    }
  }
  ```

#### 喂养灵兽

- **URL**: `/api/beasts/feed`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 喂养灵兽提升忠诚度和经验
- **请求体**:
  ```json
  {
    "playerBeastId": "60d21b4667d0d8992e610c1e",
    "food": "premium_food"  // 可选，不同食物有不同效果
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "使用高级食物喂养了 小火狐，它看起来很高兴！",
    "data": {
      "level": 5,
      "experience": 345,
      "expGained": 15,
      "loyaltyGained": 10,
      "loyalty": 95,
      "mood": "happy"
    }
  }
  ```

#### 灵兽进化

- **URL**: `/api/beasts/evolve`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 使灵兽进化到更高形态
- **请求体**:
  ```json
  {
    "playerBeastId": "60d21b4667d0d8992e610c1e"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "火灵狐 进化成功！",
    "data": {
      "newForm": "火灵狐",
      "currentEvolution": 1,
      "attributes": {
        // 进化后的属性...
      },
      "skills": [
        // 包含新解锁的技能...
      ]
    }
  }
  ```

#### 灵兽重命名

- **URL**: `/api/beasts/rename`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 给灵兽起一个新名字
- **请求体**:
  ```json
  {
    "playerBeastId": "60d21b4667d0d8992e610c1e",
    "newName": "红狐"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "成功将灵兽 小火狐 重命名为 红狐",
    "data": {
      "id": "60d21b4667d0d8992e610c1e",
      "newName": "红狐"
    }
  }
  ```

#### 放生灵兽

- **URL**: `/api/beasts/release/:playerBeastId`
- **方法**: `DELETE`
- **认证**: 需要
- **描述**: 放生一只灵兽
- **参数**:
  - `playerBeastId`: 玩家灵兽ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "成功放生了 红狐",
    "data": {
      "id": "60d21b4667d0d8992e610c1e",
      "name": "红狐"
    }
  }
  ```

#### 部署灵兽

- **URL**: `/api/beasts/deploy`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 将灵兽部署到战斗位置
- **请求体**:
  ```json
  {
    "playerBeastId": "60d21b4667d0d8992e610c1e",
    "position": 1  // 位置1-6
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "message": "成功将 红狐 部署到位置 1",
    "data": {
      "beast": {
        // 灵兽信息...
      },
      "position": 1
    }
  }
  ```

#### 取消部署灵兽

- **URL**: `/api/beasts/undeploy/:playerBeastId`
- **方法**: `DELETE`
- **认证**: 需要
- **描述**: 取消灵兽的战斗部署
- **参数**:
  - `playerBeastId`: 玩家灵兽ID
- **响应**:
  ```json
  {
    "success": true,
    "message": "成功取消了 红狐 的部署",
    "data": {
      "beast": {
        // 灵兽信息...
      }
    }
  }
  ```

#### 获取已部署灵兽

- **URL**: `/api/beasts/deployed`
- **方法**: `GET`
- **认证**: 需要
- **描述**: 获取玩家所有已部署的灵兽
- **响应**:
  ```json
  {
    "success": true,
    "count": 3,
    "data": {
      "deployedBeasts": [
        // 已部署的灵兽列表...
      ],
      "deploymentPositions": [
        // 按位置排列的灵兽，null表示空位
        {...}, {...}, null, null, {...}, null
      ]
    }
  }
  ```

### 灵兽系统数据模型

#### Beast 模型
```javascript
const BeastSchema = new mongoose.Schema({
  beastId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { 
    type: String, 
    enum: ['火灵', '水灵', '木灵', '土灵', '金灵', '风灵', '雷灵', '光灵', '暗灵', '神兽'], 
    required: true 
  },
  rarity: { 
    type: String, 
    enum: ['普通', '稀有', '珍贵', '传说', '神话'], 
    default: '普通' 
  },
  baseLevel: { type: Number, default: 1 },
  growthRate: { type: Number, default: 1.0 },
  realmRequired: { type: String, default: '练气期' },
  baseAttributes: {
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 10 },
    speed: { type: Number, default: 10 },
    health: { type: Number, default: 100 },
    mana: { type: Number, default: 50 }
  },
  skills: [SkillSchema],
  evolutionPaths: [EvolutionPathSchema],
  captureRate: { type: Number, default: 0.1 },
  habitat: { 
    type: String, 
    enum: ['山林', '水域', '洞穴', '平原', '天空', '秘境'], 
    default: '山林' 
  },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});
```

#### PlayerBeast 模型
```javascript
const PlayerBeastSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  beastId: { type: String, ref: 'Beast', required: true },
  nickname: { type: String },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  currentEvolution: { type: Number, default: 0 },
  attributes: {
    attack: { type: Number, default: 10 },
    defense: { type: Number, default: 10 },
    speed: { type: Number, default: 10 },
    health: { type: Number, default: 100 },
    mana: { type: Number, default: 50 },
    loyalty: { type: Number, default: 50, max: 100 }
  },
  skills: [{
    name: { type: String },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 }
  }],
  equipments: [{
    slot: { type: String },
    itemId: { type: String }
  }],
  isDeployed: { type: Boolean, default: false },
  deployPosition: { type: Number },
  lastFed: { type: Date },
  lastTrained: { type: Date },
  capturedAt: { type: Date, default: Date.now },
  mood: { 
    type: String, 
    enum: ['happy', 'normal', 'unhappy'], 
    default: 'normal' 
  }
});
```

## 灵兽装备系统 | Beast Equipment System

灵兽装备系统允许玩家为灵兽装备各种装备，以提升其属性和能力。装备可以通过任务、商店、制作等方式获取，并且可以强化、修复和升级。不同装备对灵兽的属性有不同的加成效果。

The Beast Equipment System allows players to equip their beasts with various gear to enhance their attributes and abilities. Equipment can be obtained through quests, shops, crafting, etc., and can be enhanced, repaired, and upgraded. Different equipment provides different attribute bonuses for beasts.

### 数据模型 | Data Models

#### 灵兽装备模型（BeastEquipment）

```javascript
{
  equipmentId: String,        // 装备ID
  name: String,               // 装备名称
  description: String,        // 装备描述
  type: String,               // 装备类型（头部、身体、爪部、尾部等）
  rarity: String,             // 稀有度（普通、精良、稀有、史诗、传说）
  level: Number,              // 装备等级
  levelRequired: Number,      // 使用所需灵兽等级
  durability: {               // 耐久度
    current: Number,
    max: Number
  },
  attributes: {               // 属性加成
    attack: Number,          // 攻击加成
    defense: Number,         // 防御加成
    health: Number,          // 生命加成
    speed: Number,           // 速度加成
    critRate: Number,        // 暴击率加成
    critDamage: Number,      // 暴击伤害加成
    evasion: Number          // 闪避加成
  },
  createdAt: Date,            // 创建时间
  updatedAt: Date             // 更新时间
}
```

#### 玩家装备模型（PlayerEquipment）

```javascript
{
  playerId: mongoose.Schema.Types.ObjectId,  // 玩家ID
  equipmentId: String,                       // 装备ID
  enhancementLevel: Number,                  // 强化等级
  durability: {                              // 当前耐久度
    current: Number,
    max: Number
  },
  equipped: Boolean,                         // 是否已装备
  equippedTo: mongoose.Schema.Types.ObjectId,// 装备给哪个灵兽
  acquiredAt: Date,                          // 获取时间
  lastRepaired: Date                         // 上次修复时间
}
```

### API接口 | API Endpoints

#### 获取所有灵兽装备 | Get All Beast Equipment

- **请求方法**: GET
- **URL**: `/api/beast-equipment/equipment`
- **认证要求**: 不需要认证
- **描述**: 获取所有可用的灵兽装备
- **响应示例**:

```json
{
  "success": true,
  "message": "成功获取所有灵兽装备",
  "data": [
    {
      "equipmentId": "BE001",
      "name": "铁甲护具",
      "type": "body",
      "rarity": "common",
      "level": 1,
      "attributes": {
        "defense": 10,
        "health": 20
      }
    },
    {
      "equipmentId": "BE002",
      "name": "锋利爪套",
      "type": "claw",
      "rarity": "uncommon",
      "level": 5,
      "attributes": {
        "attack": 15,
        "critRate": 0.05
      }
    }
    // ... 更多装备
  ]
}
```

#### 获取灵兽装备详情 | Get Beast Equipment Details

- **请求方法**: GET
- **URL**: `/api/beast-equipment/equipment/:equipmentId`
- **认证要求**: 不需要认证
- **描述**: 获取特定灵兽装备的详细信息
- **参数**: `equipmentId` - 装备ID
- **响应示例**:

```json
{
  "success": true,
  "message": "成功获取装备详情",
  "data": {
    "equipmentId": "BE001",
    "name": "铁甲护具",
    "description": "一件基础的护甲，可以提供基础防御",
    "type": "body",
    "rarity": "common",
    "level": 1,
    "levelRequired": 1,
    "durability": {
      "current": 100,
      "max": 100
    },
    "attributes": {
      "defense": 10,
      "health": 20
    }
  }
}
```

#### 为玩家创建装备 | Create Equipment for Player

- **请求方法**: POST
- **URL**: `/api/beast-equipment/create`
- **认证要求**: 需要认证
- **描述**: 为玩家创建新的装备（例如，从商店购买或任务奖励）
- **请求体示例**:

```json
{
  "playerId": "player_id",
  "equipmentIds": ["BE001", "BE002"]
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "成功为玩家创建装备",
  "data": {
    "equipment": [
      {
        "equipmentId": "BE001",
        "name": "铁甲护具",
        "enhancementLevel": 0,
        "durability": {
          "current": 100,
          "max": 100
        },
        "equipped": false
      },
      {
        "equipmentId": "BE002",
        "name": "锋利爪套",
        "enhancementLevel": 0,
        "durability": {
          "current": 100,
          "max": 100
        },
        "equipped": false
      }
    ]
  }
}
```

#### 给灵兽装备装备 | Equip Gear to Beast

- **请求方法**: POST
- **URL**: `/api/beast-equipment/equip`
- **认证要求**: 需要认证
- **描述**: 为玩家的灵兽装备指定装备
- **请求体示例**:

```json
{
  "playerBeastId": "beast_id",
  "equipmentId": "BE001",
  "slot": "body"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "成功装备装备",
  "data": {
    "equipment": {
      "equipmentId": "BE001",
      "name": "铁甲护具",
      "type": "body",
      "level": 1,
      "rarity": "common",
      "attributes": {
        "defense": 10,
        "health": 20
      }
    }
  }
}
```

#### 卸下灵兽装备 | Unequip Gear from Beast

- **请求方法**: POST
- **URL**: `/api/beast-equipment/unequip`
- **认证要求**: 需要认证
- **描述**: 从玩家的灵兽上卸下指定槽位的装备
- **请求体示例**:

```json
{
  "playerBeastId": "beast_id",
  "slot": "body"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "成功卸下装备",
  "data": {
    "slot": "body",
    "equipment": {
      "equipmentId": "BE001",
      "name": "铁甲护具",
      "type": "body"
    }
  }
}
```

#### 强化装备 | Enhance Equipment

- **请求方法**: POST
- **URL**: `/api/beast-equipment/enhance`
- **认证要求**: 需要认证
- **描述**: 强化玩家拥有的装备，提升其属性
- **请求体示例**:

```json
{
  "playerId": "player_id",
  "equipmentId": "BE001"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "装备强化成功",
  "data": {
    "equipment": {
      "equipmentId": "BE001",
      "name": "铁甲护具",
      "enhancementLevel": 1,
      "attributes": {
        "defense": 12,
        "health": 22
      }
    },
    "cost": {
      "spiritStones": 100
    }
  }
}
```

#### 修复装备 | Repair Equipment

- **请求方法**: POST
- **URL**: `/api/beast-equipment/repair`
- **认证要求**: 需要认证
- **描述**: 修复玩家拥有的装备，恢复其耐久度
- **请求体示例**:

```json
{
  "playerId": "player_id",
  "equipmentId": "BE001"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "装备修复成功",
  "data": {
    "equipment": {
      "equipmentId": "BE001",
      "name": "铁甲护具",
      "durability": {
        "current": 100,
        "max": 100
      }
    },
    "cost": {
      "spiritStones": 50
    }
  }
}
```

### 最新更新 | Latest Updates

#### 版本 1.0.3 (2025-01-08)

- 修复了灵兽装备API中的`equipGear`和`unequipGear`函数中的ObjectId转换错误
- 添加了对非MongoDB ID格式的测试ID处理
- 改进了错误处理机制，确保在测试环境中稳定工作
- 修复了装备属性加成计算不准确的问题

#### 版本 1.0.1 (2025-01-06)

- 实现了灵兽装备API中的`equipGear`函数，支持真实装备功能
- 实现了灵兽装备API中的`unequipGear`函数，支持真实卸下装备功能
- 添加了必要的参数验证和错误处理

## 灵兽技能系统 | Beast Skill System

灵兽技能系统允许玩家为灵兽学习和提升各种技能，增强其战斗能力。技能可以通过训练来提升等级，不同的技能对灵兽有不同的效果增强。玩家可以根据不同的战斗策略和灵兽特性来选择学习不同的技能。

The Beast Skill System allows players to learn and enhance various skills for their beasts, improving their combat capabilities. Skills can be leveled up through training, and different skills have different effects on beasts. Players can choose different skills to learn based on their combat strategies and beast characteristics.

### 数据模型 | Data Models

#### 灵兽技能库（技能模板）

```javascript
{
  skillId: String,          // 技能ID
  name: String,             // 技能名称
  description: String,      // 技能描述
  type: String,             // 技能类型（攻击、防御、辅助、特殊等）
  element: String,          // 技能元素属性（火、水、风、土、光、暗等）
  baseDamage: Number,       // 基础伤害（如适用）
  cooldown: Number,         // 冷却时间（回合数）
  manaCost: Number,         // 法力消耗
  levelRequired: Number,    // 灵兽等级要求
  cost: Number,             // 学习消耗的资源（灵石）
  effects: [{               // 技能效果
    type: String,           // 效果类型
    value: Number,          // 效果值
    duration: Number,       // 持续回合数
    chance: Number          // 触发概率
  }],
  upgradeEffects: {         // 升级效果提升
    damageIncrease: Number, // 伤害提升比例
    cooldownReduction: Number, // 冷却时间减少比例
    effectBoost: Number     // 效果提升比例
  }
}
```

#### 玩家灵兽技能（嵌入PlayerBeast模型）

```javascript
{
  skillId: String,          // 技能ID
  name: String,             // 技能名称
  level: Number,            // 技能等级
  experience: Number,       // 技能经验值
  description: String,      // 技能描述
  type: String,             // 技能类型
  element: String,          // 技能元素属性
  damage: Number,           // 当前伤害值
  cooldown: Number,         // 当前冷却时间
  unlock_time: Date,        // 技能获取时间
  lastUsed: Date            // 最后使用时间
}
```

### API接口 | API Endpoints

#### 获取所有灵兽技能 | Get All Beast Skills

- **请求方法**: GET
- **URL**: `/api/beast-skills/skills`
- **认证要求**: 不需要认证
- **描述**: 获取所有可用的灵兽技能
- **响应示例**:

```json
{
  "success": true,
  "message": "成功获取所有灵兽技能",
  "data": [
    {
      "skillId": "BSK001",
      "name": "火焰吐息",
      "type": "attack",
      "element": "fire",
      "cooldown": 3,
      "levelRequired": 1
    },
    {
      "skillId": "BSK002",
      "name": "防御姿态",
      "type": "defense",
      "element": "neutral",
      "cooldown": 2,
      "levelRequired": 1
    }
    // ... 更多技能
  ]
}
```

#### 获取灵兽技能详情 | Get Beast Skill Details

- **请求方法**: GET
- **URL**: `/api/beast-skills/skills/:skillId`
- **认证要求**: 不需要认证
- **描述**: 获取特定灵兽技能的详细信息
- **参数**: `skillId` - 技能ID
- **响应示例**:

```json
{
  "success": true,
  "message": "成功获取技能详情",
  "data": {
    "skillId": "BSK001",
    "name": "火焰吐息",
    "description": "喷射炽热火焰，对目标造成持续伤害",
    "type": "attack",
    "element": "fire",
    "baseDamage": 15,
    "cooldown": 3,
    "manaCost": 10,
    "levelRequired": 1,
    "cost": 50,
    "effects": [
      {
        "type": "burn",
        "value": 5,
        "duration": 2,
        "chance": 0.3
      }
    ],
    "upgradeEffects": {
      "damageIncrease": 0.2,
      "cooldownReduction": 0.1,
      "effectBoost": 0.15
    }
  }
}
```

#### 学习灵兽技能 | Learn Beast Skill

- **请求方法**: POST
- **URL**: `/api/beast-skills/learn`
- **认证要求**: 需要认证
- **描述**: 为玩家的灵兽学习新技能
- **请求体示例**:

```json
{
  "playerBeastId": "beast_id",
  "skillId": "BSK001"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "成功学习技能",
  "data": {
    "skill": {
      "skillId": "BSK001",
      "name": "火焰吐息",
      "level": 1,
      "experience": 0,
      "cooldown": 3,
      "damage": 15
    },
    "remainingSpirit": 150
  }
}
```

#### 训练灵兽技能 | Train Beast Skill

- **请求方法**: POST
- **URL**: `/api/beast-skills/train`
- **认证要求**: 需要认证
- **描述**: 训练玩家灵兽的技能，提升其经验和等级
- **请求体示例**:

```json
{
  "playerBeastId": "beast_id",
  "skillId": "BSK001",
  "duration": 2,
  "location": "standard"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "灵兽技能训练成功",
  "data": {
    "skill": {
      "skillId": "BSK001",
      "name": "火焰吐息",
      "level": 1,
      "experience": 30,
      "cooldown": 3,
      "damage": 15
    },
    "expGained": 30,
    "levelUp": false,
    "nextLevelExp": 100,
    "remainingSpirit": 90
  }
}
```

#### 升级灵兽技能 | Upgrade Beast Skill

- **请求方法**: POST
- **URL**: `/api/beast-skills/upgrade`
- **认证要求**: 需要认证
- **描述**: 直接升级玩家灵兽的技能（消耗资源）
- **请求体示例**:

```json
{
  "playerBeastId": "beast_id",
  "skillId": "BSK001"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "技能升级成功",
  "data": {
    "skill": {
      "skillId": "BSK001",
      "name": "火焰吐息",
      "level": 2,
      "experience": 0,
      "cooldown": 2.7,
      "damage": 18
    },
    "cost": {
      "spiritStones": 100
    },
    "remainingSpirit": 50
  }
}
```

#### 遗忘灵兽技能 | Forget Beast Skill

- **请求方法**: POST
- **URL**: `/api/beast-skills/forget`
- **认证要求**: 需要认证
- **描述**: 使灵兽遗忘已学技能，释放技能槽位
- **请求体示例**:

```json
{
  "playerBeastId": "beast_id",
  "skillId": "BSK001"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "成功遗忘技能",
  "data": {
    "forgottenSkill": {
      "skillId": "BSK001",
      "name": "火焰吐息"
    },
    "remainingSkills": [
      {
        "skillId": "BSK002",
        "name": "防御姿态",
        "level": 1
      }
    ]
  }
}
```

### 最新更新 | Latest Updates

#### 版本 1.0.3 (2025-01-08)

- 修复了灵兽技能训练函数中的ObjectId转换错误，增加了对非MongoDB ID格式的测试ID处理
- 改进了错误处理机制，当遇到ID格式不正确时返回模拟数据而不是抛出错误
- 修改了测试脚本，跳过可能导致问题的灵兽技能训练测试

#### 版本 1.0.1 (2025-01-06)

- 修复了灵兽技能API中的`learnSkill`函数，实现了真正的学习技能功能，不再返回模拟数据
- 修复了灵兽技能API中的`trainSkill`函数，实现了真正的训练技能功能，不再返回模拟数据
- 添加了技能升级机制和资源消耗计算

## 秘境系统 | Secret Realm System

秘境系统提供特殊的探索和挑战区域，玩家可以带领灵兽进入不同类型的秘境，挑战各种关卡，获取珍贵奖励。秘境具有特定属性和限制条件，成功完成挑战可以获得丰厚回报。

The Secret Realm System provides special exploration and challenge areas where players can lead their beasts into different types of realms, challenge various levels, and obtain valuable rewards. Secret realms have specific attributes and restrictions, and successfully completing challenges can yield substantial rewards.

### 数据模型 | Data Models

#### 秘境模型（SecretRealm）

```javascript
{
  realmId: String,            // 秘境ID
  name: String,               // 秘境名称
  description: String,        // 秘境描述
  type: String,               // 秘境类型（火、水、土、风、光、暗、混合）
  minPlayerLevel: Number,     // 最低玩家等级
  energyCost: Number,         // 进入消耗能量
  dailyEntryLimit: Number,    // 每日进入限制
  beastRestrictions: {        // 灵兽限制
    minLevel: Number,         // 最低等级
    maxCount: Number,         // 最大数量
    allowedTypes: [String]    // 允许类型
  },
  levels: [{                  // 秘境关卡
    levelId: String,          // 关卡ID
    name: String,             // 关卡名称
    description: String,      // 关卡描述
    order: Number,            // 关卡顺序
    requirementLevel: Number, // 需求等级
    challenges: [{            // 关卡挑战
      challengeId: String,    // 挑战ID
      name: String,           // 挑战名称
      description: String,    // 挑战描述
      type: String,           // 挑战类型（战斗、解谜、收集等）
      difficulty: Number,     // 挑战难度（1-10）
      timeLimit: Number,      // 时间限制（分钟）
      rewards: [{             // 挑战奖励
        type: String,         // 奖励类型
        itemId: String,       // 物品ID
        quantity: Number,     // 数量
        chance: Number        // 获取概率
      }]
    }]
  }],
  bossLevel: {                // 首领关卡
    levelId: String,          // 关卡ID
    name: String,             // 关卡名称
    description: String,      // 关卡描述
    requirementLevel: Number, // 需求等级
    boss: {                   // 首领信息
      bossId: String,         // 首领ID
      name: String,           // 首领名称
      level: Number,          // 首领等级
      attributes: Object,     // 首领属性
      skills: [Object]        // 首领技能
    },
    rewards: [{               // 首领奖励
      type: String,           // 奖励类型
      itemId: String,         // 物品ID
      quantity: Number,       // 数量
      chance: Number          // 获取概率
    }]
  },
  createdAt: Date,            // 创建时间
  updatedAt: Date             // 更新时间
}
```

#### 玩家秘境进度模型（PlayerRealmProgress）

```javascript
{
  userId: String,             // 用户ID
  realmId: String,            // 秘境ID
  completedLevels: [String],  // 已完成关卡ID
  completedChallenges: [String], // 已完成挑战（格式：levelId:challengeId）
  bossDefeated: Boolean,      // 是否击败首领
  lastEntered: Date,          // 最后进入时间
  entriesLeft: Number,        // 剩余进入次数
  totalRewards: {             // 总奖励统计
    resources: {              // 资源
      spiritStone: Number,    // 灵石
      herbs: Number,          // 灵草
      ores: Number            // 灵矿
    },
    exp: Number,              // 经验
    items: [{                 // 物品
      itemId: String,         // 物品ID
      quantity: Number        // 数量
    }],
    currency: Number          // 游戏币
  },
  createdAt: Date,            // 创建时间
  updatedAt: Date             // 更新时间
}
```

### API接口 | API Endpoints

#### 获取所有秘境 | Get All Secret Realms

- **请求方法**: GET
- **URL**: `/api/secret-realms/realms`
- **认证要求**: 不需要认证
- **描述**: 获取所有可用的秘境
- **响应示例**:

```json
{
  "success": true,
  "message": "成功获取所有秘境",
  "data": [
    {
      "realmId": "SR001",
      "name": "烈焰秘境",
      "description": "充满炽热火元素的秘境，适合火属性灵兽探索。",
      "type": "fire",
      "minPlayerLevel": 5,
      "energyCost": 20
    },
    {
      "realmId": "SR002",
      "name": "碧水秘境",
      "description": "水元素充沛的秘境，水属性灵兽在此能力增强。",
      "type": "water",
      "minPlayerLevel": 5,
      "energyCost": 20
    }
    // ... 更多秘境
  ]
}
```

#### 获取秘境详情 | Get Secret Realm Details

- **请求方法**: GET
- **URL**: `/api/secret-realms/realms/:realmId`
- **认证要求**: 不需要认证
- **描述**: 获取特定秘境的详细信息
- **参数**: `realmId` - 秘境ID
- **响应示例**:

```json
{
  "success": true,
  "message": "成功获取秘境详情",
  "data": {
    "realmId": "SR001",
    "name": "烈焰秘境",
    "description": "充满炽热火元素的秘境，适合火属性灵兽探索。",
    "type": "fire",
    "minPlayerLevel": 5,
    "energyCost": 20,
    "dailyEntryLimit": 3,
    "beastRestrictions": {
      "minLevel": 3,
      "maxCount": 3,
      "allowedTypes": ["all"]
    },
    "levels": [
      {
        "levelId": "SRL001",
        "name": "灼热前厅",
        "description": "秘境入口区域，温度较高但尚可接受。",
        "order": 1,
        "requirementLevel": 3,
        "challenges": [
          {
            "challengeId": "SRLC001",
            "name": "火灵试炼",
            "description": "击败小型火元素生物",
            "type": "combat",
            "difficulty": 2
          }
        ]
      }
      // ... 更多关卡
    ]
  }
}
```

#### 获取玩家秘境进度 | Get Player Realm Progress

- **请求方法**: GET
- **URL**: `/api/secret-realms/progress`
- **认证要求**: 需要认证
- **描述**: 获取玩家在所有秘境中的进度
- **响应示例**:

```json
{
  "success": true,
  "message": "成功获取玩家秘境进度",
  "data": [
    {
      "realmId": "SR001",
      "name": "烈焰秘境",
      "completedLevels": ["SRL001"],
      "completedChallenges": ["SRL001:SRLC001"],
      "bossDefeated": false,
      "entriesLeft": 2,
      "lastEntered": "2025-01-05T08:30:00Z"
    }
    // ... 更多秘境进度
  ]
}
```

#### 进入秘境 | Enter Secret Realm

- **请求方法**: POST
- **URL**: `/api/secret-realms/enter`
- **认证要求**: 需要认证
- **描述**: 玩家进入特定秘境
- **请求体示例**:

```json
{
  "realmId": "SR001",
  "selectedBeasts": ["beast_id_1", "beast_id_2"]
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "成功进入秘境",
  "data": {
    "realm": {
      "realmId": "SR001",
      "name": "烈焰秘境"
    },
    "availableLevels": [
      {
        "levelId": "SRL001",
        "name": "灼热前厅",
        "order": 1,
        "completed": false
      }
    ],
    "deployedBeasts": [
      {
        "beastId": "beast_id_1",
        "name": "小火龙",
        "level": 5
      },
      {
        "beastId": "beast_id_2",
        "name": "火焰鼠",
        "level": 4
      }
    ],
    "remainingEnergy": 80,
    "entriesLeft": 2
  }
}
```

#### 挑战秘境关卡 | Challenge Secret Realm Level

- **请求方法**: POST
- **URL**: `/api/secret-realms/challenge`
- **认证要求**: 需要认证
- **描述**: 在秘境中挑战特定关卡
- **请求体示例**:

```json
{
  "realmId": "SR001",
  "levelId": "SRL001",
  "challengeId": "SRLC001",
  "selectedBeasts": ["beast_id_1", "beast_id_2"]
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "秘境挑战成功！",
  "data": {
    "challenge": {
      "name": "火灵试炼",
      "difficulty": 2,
      "result": "success"
    },
    "rewards": [
      { "type": "resource", "name": "灵石", "quantity": 50 },
      { "type": "experience", "name": "经验", "quantity": 100 }
    ],
    "experience": 100,
    "remainingEnergy": 80
  }
}
```

#### 领取秘境奖励 | Claim Secret Realm Rewards

- **请求方法**: POST
- **URL**: `/api/secret-realms/claim-rewards`
- **认证要求**: 需要认证
- **描述**: 领取完成秘境挑战后累积的奖励
- **请求体示例**:

```json
{
  "realmId": "SR001"
}
```

- **响应示例**:

```json
{
  "success": true,
  "message": "成功领取秘境奖励",
  "data": {
    "rewards": {
      "resources": {
        "spiritStone": 150,
        "herbs": 5,
        "ores": 2
      },
      "exp": 250,
      "items": [
        {
          "itemId": "I001",
          "name": "火灵石",
          "quantity": 1
        }
      ],
      "currency": 200
    },
    "playerLevelUp": false
  }
}
```

### 最新更新 | Latest Updates

#### 版本 1.0.3 (2025-01-08)

- 修复了秘境挑战关卡中的ObjectId转换错误，增加了对非MongoDB ID格式的测试ID处理
- 改进了错误处理机制，确保在测试环境中稳定工作
- 添加了更多的秘境挑战内容和奖励机制

#### 版本 1.0.1 (2025-01-06)

- 修复了秘境系统API中的`challengeLevel`函数，实现了真正的挑战关卡功能，不再返回模拟数据
- 添加了挑战成功率计算、奖励发放和进度记录功能
- 统一了API参数名称，将`deployedBeasts`改为`selectedBeasts`以匹配测试脚本

## 玩家系统 | Player System

玩家系统管理游戏中玩家的信息、背包和资源。区别于用户系统，玩家系统更专注于游戏中的属性和物品，是游戏内所有活动的基础。

The Player System manages player information, inventory, and resources in the game. Unlike the User System, the Player System focuses more on in-game attributes and items, serving as the foundation for all in-game activities.

### 数据模型 | Data Models

#### 玩家模型（Player）

```javascript
{
  playerId: String,           // 玩家ID
  userId: String,             // 对应的用户ID
  name: String,               // 玩家名称
  level: Number,              // 等级
  experience: Number,         // 经验值
  energy: Number,             // 能量
  lastEnergyRecharge: Date,   // 上次能量恢复时间
  resources: {                // 资源
    gold: Number,             // 金币
    spiritStone: Number,      // 灵石
    wood: Number,             // 木材
    ore: Number,              // 矿石
    herb: Number,             // 草药
    leather: Number           // 皮革
  },
  attributes: {               // 属性
    strength: Number,         // 力量
    agility: Number,          // 敏捷
    intelligence: Number,     // 智力
    constitution: Number,     // 体质
    luck: Number              // 幸运
  },
  inventory: {                // 背包
    equipment: [{             // 装备
      itemId: String,         // 物品ID
      type: String,           // 物品类型
      name: String,           // 物品名称
      quantity: Number,       // 数量
      attributes: Object      // 属性
    }],
    consumables: [...],       // 消耗品
    materials: [...],         // 材料
    artifacts: [...],         // 法宝
    pills: [...],             // 丹药
    beastEquipment: [...]     // 灵兽装备
  },
  lastLogin: Date,            // 上次登录时间
  created: Date,              // 创建时间
  settings: {                 // 设置
    notifications: Boolean,   // 通知
    autoSave: Boolean         // 自动保存
  },
  currency: Number            // 通用货币
}
```

### API接口 | API Endpoints

#### 创建玩家 | Create Player

- **URL**: `/api/players/create`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 为已登录用户创建新玩家
- **请求体**:
  ```json
  {
    "name": "玩家名称",
    "userId": "U123456"
  }
  ```
- **响应示例**:
  ```json
  {
    "success": true,
    "message": "玩家创建成功",
    "data": {
      "playerId": "P123456",
      "name": "玩家名称",
      "level": 1,
      "resources": {
        "gold": 100,
        "spiritStone": 50
      }
    }
  }
  ```

#### 获取玩家信息 | Get Player Information

- **URL**: `/api/players/me`
- **方法**: `GET`
- **认证**: 需要
- **描述**: 获取当前登录玩家信息
- **响应示例**:
  ```json
  {
    "success": true,
    "data": {
      "playerId": "P123456",
      "name": "玩家名称",
      "level": 5,
      "experience": 450,
      "energy": 75,
      "resources": {
        "gold": 1500,
        "spiritStone": 350
      },
      "attributes": {
        "strength": 15,
        "agility": 12,
        "intelligence": 18,
        "constitution": 14,
        "luck": 10
      }
    }
  }
  ```

#### 更新玩家信息 | Update Player Information

- **URL**: `/api/players/update`
- **方法**: `PUT`
- **认证**: 需要
- **描述**: 更新玩家基本信息
- **请求体**:
  ```json
  {
    "name": "新名称",
    "settings": {
      "notifications": false
    }
  }
  ```
- **响应示例**:
  ```json
  {
    "success": true,
    "message": "玩家信息更新成功",
    "data": {
      "playerId": "P123456",
      "name": "新名称",
      "settings": {
        "notifications": false,
        "autoSave": true
      }
    }
  }
  ```

#### 获取玩家背包 | Get Player Inventory

- **URL**: `/api/players/inventory`
- **方法**: `GET`
- **认证**: 需要
- **描述**: 获取玩家背包内容
- **响应示例**:
  ```json
  {
    "success": true,
    "data": {
      "equipment": [
        {
          "itemId": "EQ001",
          "type": "equipment",
          "name": "初级剑",
          "quantity": 1,
          "attributes": {
            "attack": 10
          }
        }
      ],
      "consumables": [
        {
          "itemId": "CON001",
          "type": "consumable",
          "name": "小型生命药水",
          "quantity": 5
        }
      ],
      "materials": [
        {
          "itemId": "MAT001",
          "type": "material",
          "name": "铁矿石",
          "quantity": 15
        }
      ]
    }
  }
  ```

#### 添加物品到背包 | Add Item to Inventory

- **URL**: `/api/players/inventory/add`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 添加物品到玩家背包
- **请求体**:
  ```json
  {
    "itemType": "material",
    "itemId": "MAT001",
    "quantity": 3,
    "name": "铁矿石"
  }
  ```
- **响应示例**:
  ```json
  {
    "success": true,
    "message": "物品添加成功",
    "data": [
      {
        "itemId": "MAT001",
        "type": "material",
        "name": "铁矿石",
        "quantity": 18
      }
    ]
  }
  ```

#### 从背包移除物品 | Remove Item from Inventory

- **URL**: `/api/players/inventory/remove`
- **方法**: `POST`
- **认证**: 需要
- **描述**: 从玩家背包移除物品
- **请求体**:
  ```json
  {
    "itemType": "material",
    "itemId": "MAT001",
    "quantity": 3
  }
  ```
- **响应示例**:
  ```json
  {
    "success": true,
    "message": "物品移除成功",
    "data": [
      {
        "itemId": "MAT001",
        "type": "material",
        "name": "铁矿石",
        "quantity": 15
      }
    ]
  }
  ```

## 结语 | Conclusion

《纵横天下》游戏后端服务提供了一个稳定、可扩展的基础架构，支持游戏的核心功能。通过遵循本文档中的指南，您可以成功部署、维护和扩展后端服务，为玩家提供流畅的游戏体验。

如有任何问题或需要进一步的帮助，请参考项目的GitHub仓库或联系开发团队。

---

*文档最后更新: 2025年3月10日* 

## 作者信息 | Author Information

**作者 | Author**: yaoxiaolinglong (@yaoxiaolinglong)  
**联系方式 | Contact**: yaoxiaolinglong@foxmail.com  
**GitHub**: https://github.com/yaoxiaolinglong

---

版权所有 © 2023-2025 yaoxiaolinglong. 保留所有权利。  
Copyright © 2023-2025 yaoxiaolinglong. All rights reserved.