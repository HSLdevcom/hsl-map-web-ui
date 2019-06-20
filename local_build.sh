#!/bin/bash
set -e

ORG=${ORG:-hsldevcom}
DOCKER_TAG=${TRAVIS_BUILD_NUMBER:-latest}
DOCKER_IMAGE=$ORG/hsl-map-web-ui:${DOCKER_TAG}
DOCKER_IMAGE_LATEST=$ORG/hsl-map-web-ui:latest

docker build --tag=$DOCKER_IMAGE .

docker tag $DOCKER_IMAGE $DOCKER_IMAGE_LATEST
docker push $DOCKER_IMAGE_LATEST
