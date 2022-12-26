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
docker build . -t vistaweb-backend
```
### run docker
```
docker run -p 4000:8080 -d vistaweb-backend
```