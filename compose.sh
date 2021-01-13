#!/bin/sh

if [ "$1 $2" = "dev up" ]
then
    docker-compose --file docker-compose.dev.yml up --build --remove-orphans
    exit 0
fi

if [ "$1 $2" = "dev down" ]
then
    docker-compose --file docker-compose.dev.yml down --volumes 
    exit 0
fi

if [ "$1 $2" = "dev test" ]
then
    docker-compose --file ./tests/docker-compose.dev.yml up --build --remove-orphans
    exit 0
fi

if [ "$1 $2" = "prod up" ]
then
    docker-compose --file docker-compose.prod.yml up --build --remove-orphans --detach
    exit 0
fi

if [ "$1 $2" = "prod down" ]
then
    docker-compose --file docker-compose.prod.yml down --volumes 
    exit 0
fi

if [ "$1 $2" = "prod test" ]
then
    docker-compose --file ./tests/docker-compose.prod.yml up --build --remove-orphans
    exit 0
fi