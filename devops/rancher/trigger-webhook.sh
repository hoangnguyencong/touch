#!/bin/bash

FRONTEND_HOOK_URL="http://172.16.126.107:8080/v1-webhooks/endpoint?key=ui6kJvltqAW0gYjMjxrPeZLLj3eeTYZ49ohWJjv7&projectId=1a5"
FRONTEND_METADATA='{"push_data": {"tag": "latest"}, "repository": { "repo_name": "hoangitdct/touchfrontendnginx"}}'

BACKEND_HOOK_URL="http://172.16.126.107:8080/v1-webhooks/endpoint?key=GiplM6D1s69Rt5wi3Hw5Myx2skdYRhgX8Xy1QOpY&projectId=1a5"
BACKEND_METADATA='{"push_data": {"tag": "latest"}, "repository": { "repo_name": "hoangitdct/touchserver"}}'

function triggerWebHook {
  curl -H "Content-Type: application/json" -X POST -d $1 $2
} 

triggerWebHook  $FRONTEND_HOOK_URL $FRONTEND_METADATA
triggerWebHook  $BACKEND_HOOK_URL $BACKEND_METADATA
