#!/bin/bash

# RANCHER_ENV="production"

# ./manage-env.sh "create ${RANCHER_ENV}"
# ./manage-env.sh "active ${RANCHER_ENV}"
./manage-stack.sh "create frontend -f ../frontend-stack/docker-compose.yml --start"
./manage-stack.sh "create backend -f ../backend-stack/docker-compose.yml -r ../backend-stack/rancher-compose.yml --start"
