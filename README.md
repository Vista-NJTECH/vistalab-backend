# Introduction
南京工业大学Vista远景实验室后端API，网站点击[这里](https://www.vistalab.top/)

# Features
□ jwt  
□ joi  
□ blurhash  
# Environment
```
node -v
18.12
npm -v
8.19.2
```
# Run
## run with node
```
npm install
```
```
node app.js
```
## run with docker
### build docker
```
docker build . -t vistaweb-backend:v1
```
### run docker
```
docker run --restart=unless-stopped -p 8181:8181 --name back --link vistasql:db -d vistaweb-backend:v1
```  

# API Document
API文档部署采用apidoc插件  
详细文档请见[apidoc官网地址](https://apidocjs.com/)
## Install
```
npm install apidoc -g
```
## Generate Doc Html
```shell
~/projects/web$ apidoc -i router/ -o apidoc/
```

## Config
- 在根目录下`apidoc.json`进行配置  
- 在根目录下`package.json`中的`apidoc`属性进行网站配置
- 在`app.js`中配置`apidoc`为静态路由目录

## Address
```
http://localhost:8181/apidoc/index.html
```