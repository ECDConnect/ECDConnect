#!/bin/sh

TOKEN=$(az acr login --name apyecdreg --expose-token)
docker login apyecdreg.azurecr.io --username 00000000-0000-0000-0000-000000000000 --password "$TOKEN"
