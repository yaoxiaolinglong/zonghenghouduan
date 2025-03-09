# 《纵横天下》游戏后端服务
# Backend Service for "Zongheng Tianxia" Game

## 简介 | Introduction

本项目是《纵横天下》修仙主题游戏的后端服务，提供用户管理、角色属性、任务系统等功能的API接口。

This project is the backend service for the "Zongheng Tianxia" cultivation-themed game, providing API interfaces for user management, character attributes, task systems, and other functions.

## 技术栈 | Technology Stack

- Node.js
- Express
- MongoDB
- JWT (JSON Web Token)

## 目录结构 | Directory Structure

```
houduan/
├── models/            # 数据模型
├── routes/            # 路由模块
├── controllers/       # 控制器逻辑
├── middleware/        # 中间件
├── config/            # 配置文件
├── scripts/           # 脚本文件
├── server.js          # 服务器入口文件
└── .env               # 环境变量配置
```

## 安装与运行 | Installation and Running

### 安装依赖 | Install Dependencies

```bash
npm install
```

### 初始化数据库 | Initialize Database

```bash
node scripts/initDb.js
```

### 启动服务 | Start Server

```bash
npm start
```

开发模式启动 | Start in Development Mode:

```bash
npm run dev
```

## API接口 | API Endpoints

### 用户管理 | User Management

- `POST /api/users/register` - 注册新用户
- `POST /api/users/login` - 用户登录

### 角色属性 | Character Attributes

- `GET /api/characters/:userId` - 获取角色信息
- `PUT /api/characters/:userId` - 更新角色信息

### 任务系统 | Task System

- `GET /api/tasks` - 获取所有任务
- `POST /api/tasks/complete` - 完成任务

## 环境变量 | Environment Variables

在 `.env` 文件中配置以下环境变量：

Configure the following environment variables in the `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/zongheng-tianxia
JWT_SECRET=your_jwt_secret_key
```

## 作者 | Author

**yaoxiaolinglong** (没工作在线要饭打钱) 

[![pENevQA.jpg](https://s21.ax1x.com/2025/03/09/pENevQA.jpg)](https://imgse.com/i/pENevQA)

- GitHub: [https://github.com/yaoxiaolinglong](https://github.com/yaoxiaolinglong) 
- Email: yaoxiaolinglong@foxmail.com 
