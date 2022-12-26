# Introduction
Nothong Now!
# Env
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