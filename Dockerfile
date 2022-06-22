FROM node:16-alpine as builder

ENV WORK /opt/driver-instructions

RUN apk add git

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install app dependencies
COPY package.json yarn.lock ${WORK}
RUN yarn

# Bundle app source
COPY . ${WORK}

ARG BUILD_ENV=prod
COPY .env.${BUILD_ENV} ${WORK}/.env.production

RUN yarn build

# The actual image comes here

FROM node:16-alpine as server

ENV WORK /opt/driver-instructions

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install serve and forever
RUN yarn global add serve@^13.0.2 forever@^4.0.3

COPY --from=builder /opt/driver-instructions/build build/

CMD forever start -c "serve -s -l 3000" build/ && forever logs -f 0

