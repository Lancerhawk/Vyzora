#!/bin/bash
set -e

echo "Pulling latest code..."
CHANGES=$(git pull)

echo "$CHANGES"

if [[ "$CHANGES" == *"Already up to date."* ]]; then
    echo "No code changes detected."
    echo "Restarting containers only..."
    docker-compose -f docker-compose.prod.yml up -d
else
    echo "Code changes detected."
    echo "Rebuilding containers..."
    docker-compose -f docker-compose.prod.yml up -d --build
fi

echo "Cleaning unused images..."
docker image prune -f

echo "Deployment finished."
docker ps