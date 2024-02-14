#!/bin/bash
if [ ! "$CHANNEL_NAME" ]; then
    echo "Enter channel name"
    read -r CHANNEL_NAME
fi
if [ ! "$CHAINCODE_NAME" ]; then
    echo "Enter channel name"
    read -r CHAINCODE_NAME
fi
: "${CHANNEL_NAME:="mychannel"}"
: "${CHAINCODE_NAME:="sample-cc"}"
if [[ ! -d "bin" ]]; then

    curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh

    ./install-fabric.sh binary

fi

./network.sh up createChannel -c "${CHANNEL_NAME}" -ca -s couchdb

./network.sh deployCC -ccn "${CHAINCODE_NAME}" -ccp ../chaincode/ -ccl go -c "${CHANNEL_NAME}" -cci "Init"

# start prometheus and grafana
cd prometheus-grafana || exit
docker-compose up -d
cd ../
