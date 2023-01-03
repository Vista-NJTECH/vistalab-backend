FROM node:18.12.1

# 程序路径
WORKDIR /usr/src/app

COPY package.json ./
#RUN npm install

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

RUN cnpm install

COPY . .

EXPOSE 8181
CMD [ "node", "app.js" ]