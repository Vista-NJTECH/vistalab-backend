docker rm -f back
docker rmi vistaweb-backend:v1
docker build . -t vistaweb-backend:v1
docker run --restart=unless-stopped -p 8181:8181 --name back --link vistasql:db -d vistaweb-backend:v1