# 基础镜像
FROM node:18-alpine

# 安装必要的系统依赖
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    nginx

# 设置工作目录
WORKDIR /app

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制源代码
COPY . .

# 构建前端
RUN npm run build

# 暴露端口
EXPOSE 3000 80

# 启动脚本
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"] 