FROM node:10.17-alpine

WORKDIR /usr/app/

RUN apk add --no-cache bash

COPY package*.json ./
RUN npm install --quiet

COPY . ./

CMD [ "npm", "start" ]
