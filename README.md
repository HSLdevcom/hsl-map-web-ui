HSL Map Web UI
====================

## Install

### Clone the repo via git

```bash
$ git clone https://github.com/HSLdevcom/hsl-map-web-ui
```

### Install dependencies

```bash
$ cd hsl-map-web-ui && yarn install
```

### Digitransit apikey

Create your own apikey for Digitransit (https://portal-dev-api.digitransit.fi)
Copy .env to .env.local and place your apikey to `REACT_APP_DIGITRANSIT_APIKEY` variable.

## Run

### Start in development mode

```bash
$ yarn start
```
Runs at http://localhost:3000/kuljettaja


### Build and run in production mode without Docker

```bash
yarn build
yarn global add serve
mkdir build/kuljettaja/ # Needs to be moved under subdirectory, because the app is served under /kuljettaja-path
mv build/* build/kuljettaja/
serve build/
```
Runs at http://localhost:3000/kuljettaja/

### Build and run in Docker container

```bash
$ docker build -t hsl-map-web-ui --build-arg DIGITRANSIT_APIKEY=<your-key> .
$ docker run -d -p 0.0.0.0:3000:3000 hsl-map-web-ui
```

Note! Package.json defines the app will be run under `/kuljettaja` -path. To test your build on `localhost:3000`, change homepage to `/` and env as `REACT_APP_ROOT_PATH=/`

## License
MIT © [HSL](https://github.com/HSLdevcom)
