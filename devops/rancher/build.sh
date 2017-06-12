#!/bin/bash

echo "build server code base..."
cd ../../backend/src && \
docker build -f Dockerfile.prod -t hoangitdct/touchserver:latest .

echo "build frontend code base..."
cd ../../devops/dockers/frontend
./runner.sh prod build && ./runner.sh prod up && \

echo "build nginx for server static files"
rm -rf ../nginx-frontend/dist && cp -r ../../../frontend/touch/dist ../nginx-frontend && \
cd ../nginx-frontend && docker build -t hoangitdct/touchfrontendnginx:latest . && \

echo "push image to docker registry"
docker login --username=$1 --password=$2 && \
docker push hoangitdct/touchserver:latest && \
docker push hoangitdct/touchfrontendnginx:latest

echo "Deploy to rancher"
cd bin && ./init.sh
