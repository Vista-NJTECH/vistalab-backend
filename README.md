# Introduction
南京工业大学Vista远景实验室后端api，网站点击[这里](http://www.vistalab.online)

# Features
□ jwt  
□ joi  
□ blurhash  
# Environment
```
node -v
18.12
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