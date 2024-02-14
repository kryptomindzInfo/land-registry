# Land Registry Demo

Steps to start Land Registry Application

1. First install all required packages on your ubuntu server.

   ```
   ./setup.sh
   ```

2. Copy app/env-example to app/.env and update environment variable in .env as per your environment.

   ```
   cp app/env-example app/.env
   nano app/.env
   ```

   press ctrl+O to save and ctrl+x to exit

3. Start Network and Application

   ```
   ./start.sh
   ```

   Now you can open the website on port 8000 in your browser.

4. To stop the Network and application

   ```
   ./stop.sh
   ```

# Ports:

```
explorer | 8280
grafana | 3000
node-exporter | 9100
prometheus | 9090
cadvisor | 8180

```

# Notes

1. Some users are created beforehand when application is started in mongodb and blockchain. They are landrecord, townplanner, landofficer, surveyor, and registrar. Default password for all the user is "landrecord".

2. When a user registers a land, it has to be approved by first surveyor, next landofficer and then registrar.

3. A Google Map Key which is generated when you start billing on 'Google Maps Platform', is used for markings on google maps. This key is passed to "https://maps.googleapis.com/maps/api/js" script url in all the html file. If the key changes then you have to replace this key in all the html files wherever used.
