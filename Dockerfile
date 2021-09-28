FROM node:16-alpine3.12 as build
RUN npm i -g npm@7.21.0

ENV NODE_ENV=development
# running as root user prior to this
USER node

RUN mkdir -p /home/node/test-app-service
WORKDIR /home/node/test-app-service

COPY --chown=node:node ./test-app-service/package-lock.json ./test-app-service/package.json ./
RUN npm i -D

COPY --chown=node:node ./test-app-service ./

FROM build as test-app-service

ENV POSTGRES_USER=test
ENV POSTGRES_HOST=postgres
ENV POSTGRES_DATABASE=test
ENV POSTGRES_PASSWORD=test
ENV POSTGRES_PORT=5432
ENV PORT=3000

CMD ["npm", "run", "dev"]
# in package.json under script, remember to bind debug process to any ip
# "dev": "nodemon --inspect=0.0.0.0:9229 server.js"
