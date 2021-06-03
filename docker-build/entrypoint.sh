#!/bin/sh

ln -sf /app_node_modules/node_modules .
ln -sf /app_node_modules/package-lock.json .

echo "executing \"$@\""
exec "$@"
