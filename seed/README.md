# Database seed

Drop a `mongodump --archive --gzip` file named **`QualityReads.archive.gz`** in this
directory and it will be restored automatically the first time the `mongo`
container initialises an empty data volume.

    cp ~/Documents/QualityReads.archive.gz seed/

The restore only runs when `/data/db` is empty, so it is safe to leave the file
here — later `docker compose up` runs will not touch existing data.

Leave the directory empty to start with a fresh database. Archives here are
gitignored.
