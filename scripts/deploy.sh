#!/bin/bash

set -e  # 遇到错误立即退出

# 运行检查
bash scripts/check_deps.sh

# 安装系统依赖
bash scripts/install_deps.sh

# 安装和配置数据库
bash scripts/setup_db.sh

# 部署应用
bash scripts/setup_app.sh

# 配置Nginx
bash scripts/setup_nginx.sh

# 最终检查
echo "正在进行最终检查..."
curl -f http://localhost:3000 || (echo "错误: 应用未正常响应" && exit 1)
pm2 status
echo "部署完成！" 