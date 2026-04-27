#!/usr/bin/env bash

set -euo pipefail

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "==> ShopScout one-command deploy"

if ! command -v docker >/dev/null 2>&1; then
  echo "Error: docker is not installed."
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Error: docker compose plugin is not available."
  exit 1
fi

if [[ ! -f "server/.env.docker" ]]; then
  echo "Error: server/.env.docker not found."
  echo "Create it from template:"
  echo "  cp server/.env.docker.example server/.env.docker"
  exit 1
fi

echo "==> Pulling latest code"
git pull --rebase origin main

echo "==> Rebuilding and starting containers"
docker compose up -d --build

echo "==> Waiting for API health (up to 90s)"
for i in {1..30}; do
  if curl -fsS http://127.0.0.1:5050 >/dev/null 2>&1; then
    echo "==> Deploy successful. API is reachable on port 5050."
    docker compose ps
    exit 0
  fi
  sleep 3
done

echo "Warning: API health check did not pass in time."
echo "Check logs with:"
echo "  docker compose logs --tail=200 api"
exit 1
