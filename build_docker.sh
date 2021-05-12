docker stop cn-mall-web
docker rm cn-mall-web
docker build -t cn-mall-dashboard-web .
docker run -d --name cn-mall-web -p 9020:80 cn-mall-dashboard-web



