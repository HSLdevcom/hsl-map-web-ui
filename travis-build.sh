#!/bin/bash
set -e

ORG=${ORG:-hsldevcom}
DOCKER_TAG=${TRAVIS_BUILD_NUMBER:-latest}

if [[ $TRAVIS_BRANCH == "development" ]]; then
  DOCKER_TAG=dev
fi

if [[ $TRAVIS_BRANCH == "stage" ]]; then
  DOCKER_TAG=stage
fi

if [[ $TRAVIS_BRANCH == "master" ]]; then
  DOCKER_TAG=production
fi

DOCKER_IMAGE=$ORG/hsl-map-web-ui:${DOCKER_TAG}
DOCKER_IMAGE_LATEST=$ORG/hsl-map-web-ui:latest

docker build --tag=$DOCKER_IMAGE .

if [[ $TRAVIS_PULL_REQUEST == "false" ]]; then
  docker login -u $DOCKER_USER -p $DOCKER_AUTH
  docker push $DOCKER_IMAGE
  docker tag $DOCKER_IMAGE $DOCKER_IMAGE_LATEST
  docker push $DOCKER_IMAGE_LATEST
fi
