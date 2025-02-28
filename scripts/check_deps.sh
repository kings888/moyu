#!/bin/bash

# 检查系统依赖
check_system_deps() {
  deps=("node" "npm" "mongodb" "redis-server" "nginx")
  for dep in "${deps[@]}"; do
    if ! command -v $dep &> /dev/null; then
      echo "错误: 未安装 $dep"
      exit 1
    fi
  done
}

# 检查Node.js版本
check_node_version() {
  required_version="18.0.0"
  current_version=$(node -v | cut -d'v' -f2)
  if [ $(printf '%s\n' "$required_version" "$current_version" | sort -V | head -n1) != "$required_version" ]; then
    echo "错误: Node.js版本必须 >= $required_version"
    exit 1
  fi
}

# 检查服务状态
check_services() {
  services=("mongodb" "redis" "nginx")
  for service in "${services[@]}"; do
    if ! systemctl is-active --quiet $service; then
      echo "错误: $service 服务未运行"
      exit 1
    fi
  done
}

# 检查目录权限
check_permissions() {
  dirs=("/var/www/fishing-site" "/data/db" "/var/log/nginx")
  for dir in "${dirs[@]}"; do
    if [ ! -w "$dir" ]; then
      echo "错误: 缺少目录写入权限 $dir"
      exit 1
    fi
  done
}

# 运行所有检查
check_system_deps
check_node_version
check_services
check_permissions 