#!/bin/bash

sudo docker run -d -v touch_rancher:/var/lib/mysql --restart=unless-stopped -p 8080:8080 rancher/server