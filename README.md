# oner365-vue

#### Description
个人练习 前端采用RuoYi Vue 参考 RuoYi 项目 Element UI版本 (https://gitee.com/y_project/RuoYi-Vue/tree/master/ruoyi-ui)

## 开发

```bash

# 进入项目目录
cd oner365-vue

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:8701

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```