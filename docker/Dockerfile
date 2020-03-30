FROM node:11.10-alpine

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV PATH=$PATH:/home/node/.npm-global/bin

RUN apk add --update pkgconfig autoconf automake libtool nasm build-base zlib-dev libpng alpine-sdk \
  && rm -rf /var/cache/apk/*

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

USER node

RUN yarn global add nodemon knex

CMD sleep 360h
