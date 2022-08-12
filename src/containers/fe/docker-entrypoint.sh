#!/bin/sh

npm i -g http-server
cd /usr/share/nginx/html
node --max-http-header-size=80000 /usr/local/lib/node_modules/http-server/bin/http-server --port 8000 &
nginx &
tail -f /dev/null