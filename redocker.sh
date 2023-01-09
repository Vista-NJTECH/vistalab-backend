docker rm -f back
docker rmi vistaweb-backend:v1
apidoc -i routes/ -o apidoc/
cp ../config.js .
docker build . -t vistaweb-backend:v1
docker run --restart=unless-stopped -p 8181:8181 --name back -v /home/doiry/projects/web/vistalab-backend/public:/usr/src/app/public --link  tomcat-db-1:db --network tomcat_default -d vistaweb-backend:v1
cp ../config2.js ./config.js