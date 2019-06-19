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
COPY .env.production ${WORK}/.env

RUN yarn build

EXPOSE 3000

CMD yarn serve
