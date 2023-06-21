#!/bin/bash

cd /home/node/app
npm i --legacy-peer-deps
rm -rf dist
npm run start:dev

# precisa converter os caracteres de final de linha usando
# dos2unix ./.docker/entrypoint.sh
# chmod +x ./.docker/entrypoint.sh