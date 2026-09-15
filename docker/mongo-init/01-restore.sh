#!/bin/bash
# Restores a mongodump archive on first boot.
#
# Scripts in /docker-entrypoint-initdb.d only run when /data/db is empty, which
# is exactly the semantics we want: `docker compose up -d` seeds the database
# once, and every restart afterwards leaves it alone.
set -euo pipefail

ARCHIVE="/seed/QualityReads.archive.gz"

if [ ! -f "$ARCHIVE" ]; then
  echo "[init] no archive at $ARCHIVE, starting with an empty database"
  exit 0
fi

echo "[init] restoring from $ARCHIVE ..."
mongorestore \
  --archive="$ARCHIVE" \
  --gzip \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  --drop
echo "[init] restore complete"
