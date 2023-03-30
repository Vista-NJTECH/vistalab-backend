FROM node:18.12-slim

# 程序路径
WORKDIR /usr/src/app

COPY package.json ./
#RUN npm install

COPY . .

RUN npm config set registry http://registry.npm.taobao.org
RUN npm install

EXPOSE 8181
EXPOSE 8183
CMD [ "node", "app.js" ]