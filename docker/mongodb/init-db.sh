
#!/usr/bin/env bash
echo "Creating mongo DB..."
mongo admin --host localhost -u $MONGO_INITDB_ROOT_USERNAME -p $MONGO_INITDB_ROOT_PASSWORD --eval "initdb = db.getSiblingDB('"$MONGO_INITDB_DATABASE"');initdb.createUser({user: '"$MONGO_USERNAME"', pwd: '"$MONGO_PASSWORD"', roles: [{role: 'dbOwner', db: '"$MONGO_INITDB_DATABASE"'}]});"
echo "Mongo DB created."