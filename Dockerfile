FROM node:12-alpine

ENV WORK /opt/driver-instructions

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install app dependencies
COPY package.json ${WORK}
COPY yarn.lock ${WORK}
RUN yarn

# Bundle app source
COPY . ${WORK}

ARG BUILD_ENV=production
COPY .env.${BUILD_ENV} ${WORK}/.env.production

RUN yarn build
CMD yarn run production
