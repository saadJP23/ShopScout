#!/usr/bin/env bash

set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: ./scripts/switch-env.sh <local|aws>"
  exit 1
fi

TARGET_ENV="$1"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

case "$TARGET_ENV" in
  local|aws) ;;
  *)
    echo "Invalid environment: $TARGET_ENV"
    echo "Usage: ./scripts/switch-env.sh <local|aws>"
    exit 1
    ;;
esac

SERVER_SOURCE="server/.env.${TARGET_ENV}"
CLIENT_SOURCE="client/.env.${TARGET_ENV}"

if [[ ! -f "$SERVER_SOURCE" ]]; then
  echo "Missing $SERVER_SOURCE"
  echo "Create it from template:"
  echo "  cp server/.env.${TARGET_ENV}.example $SERVER_SOURCE"
  exit 1
fi

if [[ ! -f "$CLIENT_SOURCE" ]]; then
  echo "Missing $CLIENT_SOURCE"
  echo "Create it from template:"
  echo "  cp client/.env.${TARGET_ENV}.example $CLIENT_SOURCE"
  exit 1
fi

cp "$SERVER_SOURCE" "server/.env"
cp "$CLIENT_SOURCE" "client/.env"

echo "Switched environment to: $TARGET_ENV"
echo "Active files:"
echo "  server/.env <- $SERVER_SOURCE"
echo "  client/.env <- $CLIENT_SOURCE"
echo ""
echo "Restart your processes:"
echo "  cd server && npm start"
echo "  cd client && npm start"
