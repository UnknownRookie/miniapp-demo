# Mini App Full Stack Demo

首版目标：

- 微信小程序登录
- 登录后进入商品详情页
- 后端权限校验
- MySQL 数据落库

## 目录结构

```text
.
├── miniprogram
└── server
```

## 启动步骤

### 1. 初始化数据库

确保本地 MySQL 已启动，并创建数据库：

```sql
CREATE DATABASE miniapp_demo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

进入后端目录后执行：

```bash
npm install
npm run db:init
```

### 2. 启动服务端

```bash
cd server
npm install
npm run dev
```

默认端口：`3000`

### 3. 启动小程序

用微信开发者工具打开目录：

`/Users/liubing/Desktop/小程序，前端+后端/miniprogram`

开发工具内确认请求域名或在本地调试时使用不校验合法域名的模式。

## 默认接口

- `POST /api/auth/wx-login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/products/:id`

## 环境变量

参考 [server/.env.example](/Users/liubing/Desktop/小程序，前端+后端/server/.env.example)。

## 说明

- 当前小程序默认跳转商品 `id=1`
- 真机调试时请把小程序请求地址改成你电脑的局域网 IP 或测试域名
