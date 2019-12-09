#!/usr/bin/env bash

mongoimport --db $MONGO_INITDB_DATABASE --collection testcases --file ./testdata/testcases.json --jsonArray
mongoimport --db $MONGO_INITDB_DATABASE --collection testresults --file ./testdata/testresults.json --jsonArray
mongoimport --db $MONGO_INITDB_DATABASE --collection tags --file ./testdata/tag.json --jsonArray
