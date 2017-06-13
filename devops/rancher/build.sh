#!/bin/bash

echo "build server code base..."
cd ../../backend/src
docker build -f Dockerfile.prod -t hoangitdct/touchserver:latest .

echo "build frontend code base..."
cd ../../devops/dockers/frontend
./runner.sh prod build && ./runner.sh prod up && \

echo "build nginx for server static files"
rm -rf ../nginx-frontend/dist && \
docker cp touchdb_frontend_prod:/frontend/touch/dist ../nginx-frontend && \
# cp -r ../../../frontend/touch/dist ../nginx-frontend && \
cd ../nginx-frontend && docker build -t hoangitdct/touchfrontendnginx:latest . && \

echo "push image to docker registry"
docker login --username=$1 --password=$2 && \
docker push hoangitdct/touchserver:latest && \
docker push hoangitdct/touchfrontendnginx:latest

echo "caching image"
if [ $3 ]
then
  echo $3
  NOW=`date +%Y-%m-%d-%H-%M-%S`
  docker tag hoangitdct/touchserver:latest "hoangitdct/touchserver:latest-${NOW}"
  docker tag hoangitdct/touchfrontendnginx:latest "hoangitdct/touchfrontendnginx:latest-${NOW}"
fi
