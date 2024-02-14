#!/bin/bash

if [ ! "$SERVER_IP" ]; then
    echo "Enter server's public ip address. Press enter if it is localhost."
    read -r SERVER_IP
fi
: "${SERVER_IP:="localhost"}"
echo "${SERVER_IP}"
if [[ ! -d "node_modules" ]]; then

    npm install

fi

# updated ipfs server ip
sed -i "5s/\".*\",/\"http:\/\/${SERVER_IP}:8000\",/" view/js/events.js
sed -i "7s/\".*\",/\"http:\/\/${SERVER_IP}:8080\",/" view/js/events.js

# enroll admin and register user
if [[ ! -d wallet ]]; then
    node enrollAdminandRegisterUser.js
fi
pm2 start pm2.config.js
pm2 logs landreg
