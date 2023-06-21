FROM node:18-alpine
RUN apk update && apk upgrade && apk add bash
RUN npm config set cache /home/node/app/.npm-cache --global
RUN npm i -g @nestjs/cli
USER node
WORKDIR /home/node/app