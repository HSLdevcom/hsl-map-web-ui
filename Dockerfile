FROM node:12-alpine

ARG BUILD_ENV=production
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
COPY .env.${BUILD_ENV} ${WORK}/.env

RUN yarn build
CMD yarn run production

