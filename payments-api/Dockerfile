FROM node:10
WORKDIR /usr/src/app
COPY . payments-api
WORKDIR /usr/src/app/payments-api/
EXPOSE 3001
RUN npm ci
RUN rm -rf dist && npm run build
CMD npm run start
