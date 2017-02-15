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
Runs at http://localhost:3000/kuljettaja


### Build and run in Docker container

```bash
$ docker build -t hsl-map-web-ui .
$ docker run -d -p 0.0.0.0:3000:3000 hsl-map-web-ui
```

Uses REST APIs from [hsl-map-generator-server](https://github.com/HSLdevcom/hsl-map-generator-server) (localhost:8000).
