FROM node:18.12-slim

# 程序路径
WORKDIR /usr/src/app

COPY package.json ./
#RUN npm install

COPY . .
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

RUN cnpm install


EXPOSE 8181
CMD [ "node", "app.js" ]