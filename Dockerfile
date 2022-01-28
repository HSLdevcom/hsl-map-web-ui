FROM node:12-alpine as builder

ENV WORK /opt/driver-instructions

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install app dependencies
COPY package.json yarn.lock ${WORK}/
RUN yarn

# Bundle app source
COPY . ${WORK}

ARG BUILD_ENV=prod
COPY .env.${BUILD_ENV} ${WORK}/.env.production

RUN yarn build

FROM nginx:1.21-alpine
COPY --from=builder /opt/driver-instructions/build /usr/share/nginx/html
