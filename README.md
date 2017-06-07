# Project Name

Touch

## Description

Learning Rancher Advance

### Target

- Rancher: Learn how to scaling, auto build

## Getting Started

### Prerequisities

- Node >= 7.9.0

- NPM >= 4.2.0

- Docker v17.03.1-ce

- Docker compose v1.13.0

- Rancher 1.6

## Development

### Backend

- Development mode:

  + Environment: development

  + Build: ./runner dev build

  + Up: ./runner dev up

  + Stop: ./runner dev stop

  + Endpoint: localhost:80

- Test mode:

  + Environment: test

  + Build: ./runner test build
  
  + Up: ./runner test up

  + Stop: ./runner test stop

- Production mode:

  + Environment: productuon

  + Build: ./runner prod build
  
  + Up: ./runner prod up

  + Stop: ./runner prod stop

### Frontend

- Development mode:

  + Environment: development

  + Build: ./runner dev build

  + Up: ./runner dev up

  + Stop: ./runner dev stop

  + Endpoint: localhost:8093

- Production mode:

  + Environment: production

  + Build: ./runner prod build

  + Up: ./runner prod up

  + Stop: ./runner prod stop

  + Endpoint: localhost:8093

## Deloyment steps

  - Switch to touch/rancher

  - Run bash script: `./init-rancher.sh` for start rancher server

  - Run bask script: `./build.sh docker_hub_username docker_hub_password` for build and push images

  - Switch to vagrant_box
  
  - Run: vagrant up && vagrant ssh && curl https://releases.rancher.com/install-docker/17.03.sh | sh

  - Open url: http://your.ip.address:8080 to access rancher server

  - Add new enviroment, ex: production

  - Add new a custom host with labels touchfrontend=true, touchbackend=true, touchbackendlb=true

  - Add backend stack for group backend services, attack backend-stack.yml and rancher-compose.yml in touch/rancher

  - Add frontend stack, attack frontend-stack.yml in touch/rancher

  - Verfify backend: access to http://192.168.33.10:8081/

  - Verfify frontend: access to http://192.168.33.10:8094/


## Contributing

## Authors

Hoang Nguyen - This is an example project only for learning purpose
