#!/bin/sh

cd /src
unzip -o app-lxp.zip
npm i -g http-server && node --max-http-header-size=80000 /usr/local/lib/node_modules/http-server/bin/http-server --proxy http://localhost:80
