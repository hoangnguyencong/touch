#!/bin/bash

echo "build server code base..."
cd ../../backend/src && \
docker build -f Dockerfile.prod -t hoangitdct/touchserver:latest .

echo "build frontend code base..."
cd ../../devops/dockers/frontend
./runner.sh prod build && ./runner.sh prod build && \
./runner.sh prod build && ./runner.sh prod up && \

echo "build nginx for server static files"
rm -rf ../nginx-frontend/dist && cp -r ../../../frontend/touch/dist ../nginx-frontend && \
cd ../nginx-frontend && docker build -t hoangitdct/touchfrontendnginx:latest . && \

echo "push image to docker registry"
docker login --username=$1 --password=$2 && \
docker push hoangitdct/touchserver:latest && \
docker push hoangitdct/touchfrontendnginx:latest


./rancher-compose --url http://172.16.126.107:8080/ --access-key FD8F907ACA24225129B8 --secret-key VQpRer7CxS3UAgBbAtZ4TeBQe2FuDsRru4e6acmu -f backend-stack/docker-compose.yml -r backend-stack/rancher-compose.yml -p backend up -d

./rancher --url http://172.16.126.107:8080/ --env staging --access-key 49D36904BF70CE39762B --secret-key gdenj96YVe14QJX3UQUXwiFr5z1ff9TN2Nj97rr9 hosts ls