HSL Map Web UI
====================

## Install

### Clone the repo via git

```bash
$ git clone https://github.com/HSLdevcom/hsl-map-web-ui
```

### Install dependencies

```bash
$ cd hsl-map-web-ui && npm install
```


## Run

### Start in development mode

```bash
$ npm start
```
Runs at http://localhost:3000/


### Build and run in production mode without Docker

```bash
$ npm run build
$ npm run start-prod
```
Runs at http://localhost:3000/


### Build and run in Docker container

```bash
$ docker build --build-arg ROOT_PATH=application-root-path -t hsl-map-web-ui .
$ docker run -d -p 0.0.0.0:3000:3000 hsl-map-web-ui
```
The build-arg ROOT_PATH is optional. If the application location is determined e.g. in a reverse proxy, the ROOT_PATH should match this location. The application will run at domain/*application-root-path*.


Uses REST APIs from [hsl-map-generator-server](https://github.com/HSLdevcom/hsl-map-generator-server) (localhost:8000).

## License
MIT © [HSL](https://github.com/HSLdevcom)
