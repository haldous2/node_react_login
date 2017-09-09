
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const users = require('./server/routes/users');

let app = express();
let router = express.Router();

app.disable('x-powered-by'); // server name block

//now we should configure the API to use bodyParser and look for
//JSON data in the request body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//To prevent errors from Cross Origin Resource Sharing, we will set
//our headers to allow CORS with middleware like so:
app.use(function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');

    //and remove cacheing so we get the most recent comments
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//now we can set the route path & initialize the API
app.use('/api/users', users);
// app.use('/', function(req, res) {
//     res.json({ message: 'API Initialized!'});
// });

// Define the port.
const port = 3001;

// Start the HTTP(S) server.
app.listen(port, () => {
    console.log(`=== express running on port ${port} ===`);
});
