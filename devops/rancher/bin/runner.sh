#!/bin/bash

RANCHER_HOST="http://172.16.126.107:8080/"
RANCHER_ACCESS_KEY="BF65DB58560E07772A0F"
RANCHER_SECRET_KEY="wGphAKxeZ5AbKr3p7JLxdavVyFr4Yrk7ANhAGnvx"

./rancher --url $RANCHER_HOST --access-key $RANCHER_ACCESS_KEY --secret-key $RANCHER_SECRET_KEY $1
