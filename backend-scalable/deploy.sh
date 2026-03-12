#!/bin/bash
set -e

echo "Pulling latest code..."
git pull

echo "Stopping containers..."
docker-compose -f docker-compose.prod.yml down

echo "Building and starting containers..."
docker-compose -f docker-compose.prod.yml up -d --build

echo "Cleaning old images..."
docker image prune -f

echo "Deployment finished."
docker ps