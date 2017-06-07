#!/bin/bash

case $1 in
     "dev")
          docker-compose -f docker-compose.dev.yml $2
          ;;
     "test")
          docker-compose -f docker-compose.test.yml $2
          ;;
      "prod")
          docker-compose -f docker-compose.prod.yml $2
          ;;
esac