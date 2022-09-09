#! /bin/bash

if [ "$1" == "stop" ]
then
    docker compose -f docker-compose.db.yml down 
else
    docker compose -f docker-compose.db.yml up -d --build && \
    docker compose -f docker-compose.db.yml logs --tail 1000 -f
fi