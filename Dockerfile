FROM node:6

ARG ROOT_PATH 

ENV WORK /opt/mapgenerator
ENV ROOT_PATH ${ROOT_PATH}

# Create app directory
RUN mkdir -p ${WORK}
WORKDIR ${WORK}

# Install app dependencies
COPY package.json ${WORK}
RUN npm install

# Bundle app source
COPY . ${WORK}
RUN npm run build

EXPOSE 3000

CMD npm run start-prod
