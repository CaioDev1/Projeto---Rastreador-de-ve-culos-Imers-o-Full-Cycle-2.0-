FROM node:16-alpine

WORKDIR /react-app/

RUN apk add --no-cache bash

#USER node

COPY . /react-app/

RUN chmod +x /react-app/.docker/entrypoint.sh
