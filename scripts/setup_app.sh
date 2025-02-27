#!/bin/bash

# 安装依赖
npm install --production --legacy-peer-deps

# 构建前端
npm run build

# 启动服务
sudo npm install -g pm2
pm2 start src/server/app.js --name fishing-site
pm2 save 