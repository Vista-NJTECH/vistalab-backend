docker rm -f back
docker rmi vistaweb-backend:v1
apidoc -i routes/ -o apidoc/
cp ../config.js .
docker build . -t vistaweb-backend:v1
docker run --restart=unless-stopped -p 8181:8181 -p 8183:8183 --name back -v public:/usr/src/app/public --link  mysql_db_1:db --network mysql_default -d vistaweb-backend:v1
cp ../config2.js ./config.js