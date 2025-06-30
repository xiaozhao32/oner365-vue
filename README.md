

# oner365-vue

## 项目简介
这是一个基于 Vue.js 的前端项目，旨在为用户提供一个高效、稳定的管理系统界面。项目结构清晰，模块化程度高，便于扩展和维护。

## 开发环境搭建
### 进入项目目录
确保你已经克隆本项目到本地，并通过终端进入项目根目录。

### 安装依赖
使用 npm 或 yarn 安装项目依赖：
```bash
npm install
```
或者
```bash
yarn install
```

> **注意**：建议不要直接使用 cnpm 安装依赖，可能会导致各种诡异的 bug。如果你遇到 npm 下载速度慢的问题，可以使用以下命令配置 npm 镜像：
```bash
npm config set registry https://registry.npmmirror.com
```

### 启动开发服务
安装完依赖后，运行以下命令启动本地开发服务器：
```bash
npm run serve
```
或者
```bash
yarn serve
```

服务器启动后，默认会在 `http://localhost:8080` 上运行。

## 构建与发布
### 构建测试环境
运行以下命令构建测试环境版本：
```bash
npm run build:stage
```
或者
```bash
yarn build:stage
```

### 构建生产环境
运行以下命令构建生产环境版本：
```bash
npm run build
```
或者
```bash
yarn build
```

构建完成后，生成的文件会存放在 `dist` 文件夹中。

## 项目结构
- **API 模块**：所有与后端交互的 API 集中存放在 `src/api` 目录下，包括登录、系统管理、监控、工具等功能模块。
- **组件**：通用组件存放在 `src/components` 目录，如分页组件、图标选择器、面包屑导航等。
- **布局**：页面布局相关组件存放在 `src/layout` 目录，包括侧边栏、导航栏、主界面等。
- **工具类**：工具类函数存放在 `src/utils` 目录，包括权限控制、表单生成、加密、请求封装等。
- **页面视图**：所有页面视图存放在 `src/views` 目录，按功能模块划分。

## 功能模块
- **系统管理**：包含用户管理、角色管理、菜单管理、组织管理、日志管理等模块。
- **监控模块**：提供对缓存、ElasticSearch、FastDFS、RabbitMQ、服务状态等的监控能力。
- **工具模块**：包含代码生成器、Swagger 接口文档等工具。
- **组件模块**：封装了多种常用 UI 组件，如编辑器、分页器、图标选择器等。

## 技术栈
- Vue.js
- Element UI
- SCSS
- Babel
- ESLint

## 贡献与反馈
欢迎提交 PR 或报告 bug。请在 Gitee 上提交 issue 或联系项目维护者获取更多信息。

## 许可证
本项目遵循 MIT 许可证，详细信息请参见 [LICENSE](LICENSE) 文件。