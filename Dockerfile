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

# Apikey for Digitransit maps
ARG DIGITRANSIT_APIKEY
ENV REACT_APP_DIGITRANSIT_APIKEY=${DIGITRANSIT_APIKEY}

RUN yarn build

# The actual image comes here

FROM node:16-alpine as server

ENV WORK /opt/driver-instructions

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install serve
RUN yarn global add serve@^14.2.0

COPY --from=builder /opt/driver-instructions/build build/

CMD ["serve", "-s", "-l", "3000", "build/"]

