#!/bin/bash

echo "Enter server's public ip address"
read -r SERVER

export SERVER_IP=$SERVER
export CHANNEL_NAME=mychannel
export CHAINCODE_NAME=landreg-cc

# start network
cd network || exit
./start-network.sh

# start ipfs container
cd ../ipfs || exit
./start-ipfs.sh

# start explorer
cd ../explorer || exit
./start-explorer.sh

# update mongodb
cd ../mongo-data || exit
./init-mongodb.sh

# start application
cd ../app || exit
./start-app.sh
