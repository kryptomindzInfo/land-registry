#!/bin/bash

mongoimport --db=landrecords --collection=users --file=./users.json

printf "...\n\n Inserting regions. ...\n\n"

mongoimport --db=landrecords --collection=region --file=./region.json

printf "...\n\n Inserting districts. ...\n\n"

mongoimport --db=landrecords --collection=district --file=./district.json

printf "...\n\n Inserting wards. ...\n\n"

mongoimport --db=landrecords --collection=ward --file=./ward.json
