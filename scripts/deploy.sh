#!/bin/bash

# 安装基础依赖
bash scripts/install_deps.sh

# 安装和配置数据库
bash scripts/setup_db.sh

# 部署应用
bash scripts/setup_app.sh

# 配置Nginx
bash scripts/setup_nginx.sh

echo "部署完成！" 