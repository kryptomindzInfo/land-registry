// nodejs server setup

// call the packages we need
var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var path = require("path");
var compression = require("compression");
require("dotenv").config();

// instantiate the app
var app = express();

// Load all of our middleware
// configure app to use bodyParser()
// this will let us get the data from a POST
// app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// this line requires and runs the code from our router.js file and passes it app
app.use("/", require("./router"));

//use compression
app.use(compression());
// set up a static file server that points to the "client" directory
app.use(express.static(path.join(__dirname, "./view")));

// Save our port
var port = process.env.PORT || 8000;

// Start the server and listen on port
app.listen(port, function () {
  console.log("Listening on port: " + port);
});
