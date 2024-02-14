#!/bin/bash
echo "Enter Chancode Sequence"
read -r CCS

echo "Enter chaincode version"
read -r CCV

CHANNEL_NAME=mychannel
CHAINCODE_NAME=landreg-cc
cd network || exit
./network.sh deployCC -ccn $CHAINCODE_NAME -ccp ../chaincode -ccl go -c $CHANNEL_NAME -ccv $CCV -ccs $CCS
