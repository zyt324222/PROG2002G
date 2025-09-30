# 慈善活动管理网站

基于Node.js、Express.js和MySQL的慈善活动管理平台。

## 功能特性
- 🏠 首页展示活动列表
- 🔍 活动搜索筛选
- 📋 活动详情查看
- 📊 筹款进度显示
- 📱 响应式设计

## 技术栈
- **后端**: Node.js, Express.js, MySQL2
- **前端**: HTML5, CSS3, JavaScript
- **数据库**: MySQL

## 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 数据库设置
```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE charityevents_db;"

# 导入数据
mysql -u root -p charityevents_db < charityevents_db.sql
```

### 3. 配置环境变量
复制 `.env` 文件并修改数据库配置。

### 4. 启动应用
```bash
npm start
```

访问 http://localhost:3000

## API端点
- `GET /api/events` - 获取活动列表
- `GET /api/events/search` - 搜索活动
- `GET /api/events/:id` - 获取活动详情
- `GET /api/categories` - 获取活动类别
- `GET /api/organisations` - 获取组织信息