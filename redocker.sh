#!/bin/bash

# 检查容器是否存在并停止
if docker ps -a --format '{{.Names}}' | grep -Eq "^back$"; then
    docker stop back
    docker rm back
fi

# 检查镜像是否存在并删除
if docker images --format '{{.Repository}}:{{.Tag}}' | grep -Eq "^vistaweb-backend:v1$"; then
    docker rmi vistaweb-backend:v1
fi

# 生成 API 文档
apidoc -i routes/ -o apidoc/

# 复制配置文件
cp ../config.js .

# 构建容器镜像
docker build . -t vistaweb-backend:v1

# 运行容器
docker run --restart=unless-stopped -p 8181:8181 -p 8183:8183 --name back -v public:/usr/src/app/public --link mysql_db_1 --network mysql_default -d vistaweb-backend:v1

# 复制另一个配置文件
cp ../config2.js ./config.js