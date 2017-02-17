FROM node:6

ENV WORK /opt/mapgenerator
ENV ROOT_PATH /kuljettaja

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
