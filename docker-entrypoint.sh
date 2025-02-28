#!/bin/sh

# 等待MongoDB和Redis准备就绪
echo "Waiting for MongoDB..."
while ! nc -z mongo 27017; do sleep 1; done

echo "Waiting for Redis..."
while ! nc -z redis 6379; do sleep 1; done

# 启动Nginx
nginx

# 启动Node应用
node src/server/app.js 