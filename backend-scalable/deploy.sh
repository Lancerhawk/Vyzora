#!/bin/bash

echo "Pulling latest code..."
git pull

echo "Building and restarting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "Cleaning old images..."
docker image prune -f

echo "Deployment finished."

docker ps