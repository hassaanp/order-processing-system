FROM node:10
WORKDIR /usr/src/app
COPY . gateway
WORKDIR /usr/src/app/gateway/
RUN npm ci
RUN rm -rf dist && npm run build
CMD npm run start
