#!/bin/bash

curl -H "Content-Type: application/json" -X POST -d '{"push_data": {"tag": "latest"}, "repository": { "repo_name": "hoangitdct/touchfrontendnginx"}}' "http://172.16.126.107:8080/v1-webhooks/endpoint?key=ui6kJvltqAW0gYjMjxrPeZLLj3eeTYZ49ohWJjv7&projectId=1a5"
curl -H "Content-Type: application/json" -X POST -d '{"push_data": {"tag": "latest"}, "repository": { "repo_name": "hoangitdct/touchserver"}}' "http://172.16.126.107:8080/v1-webhooks/endpoint?key=GiplM6D1s69Rt5wi3Hw5Myx2skdYRhgX8Xy1QOpY&projectId=1a5"
