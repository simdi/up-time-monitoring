/*
* @author: Chisimdi Damian Ezeanieto
* @date: 20/01/2019
*/
// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

const httpsCertPath = './https/cert.pem';
const httpsKeyPath = './https/key.pem';
const httpPort = process.env.PORT || config.httpPort;
const httpsPort = process.env.PORT || config.httpsPort;
const env = config.envName;

// Instantiate the http server
const httpServer = http.createServer((req, res) => {
    unifiedServer(req, res);
});
// Start the http server and have it listen to the port specified.
httpServer.listen(httpPort, _=> {
    console.log(`Http server is running in ${env} on port ${httpPort}`);
});
// Instantiate the https server
const httpsServerOptions = {
    cert: fs.readFileSync(httpsCertPath),
    key: fs.readFileSync(httpsKeyPath)
};
const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
    unifiedServer(req, res);
});
// Start the https server and have it listen to the port specified.
httpsServer.listen(httpsPort, _=> {
    console.log(`Https server is running in ${env} on port ${httpsPort}`);
});

// All the server logic for both the http and https server.
const unifiedServer = (req, res) => {
    // Get the url and parse it.
    const parsedUrl = url.parse(req.url, true);
    console.log('Parsed Url', parsedUrl);
    // Get the path
    const path = parsedUrl.pathname;
    // Trim the path so that we can undestand what the user is asking for.
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    // Get the query string as an object
    const queryStringObject = parsedUrl.query;
    // Get the headers as an object
    const headers = req.headers;
    // Get the http method
    const method = req.method.toUpperCase();
    // Get the payload is there is any
    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => {
        console.log('Data', data);
        buffer += decoder.write(data);
        console.log('Buffer', buffer);
    });

    req.on('end', _=> {
        buffer += decoder.end();
        // Choose the handler the request should go to.
        // If one doesn't exit send the request to the 404 handler
        const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : router.notFound;
        // Construct the data to send to the handler
        const data = { trimmedPath, queryStringObject, method, headers,payload: buffer };

        // Route the request to the chosen handler
        chosenHandler(data, (statusCode, payload) => {
            // Use the statusCode return by the handler, othewise, default the 200.
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            // Use the payload return by the handler, or default to an empty object.
            payload = typeof(payload) == 'object' ? payload : {};
            // Convert the payload to a string.
            const payloadString = JSON.stringify(payload);
            // Return the response.
            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            // Log the path of the request
            console.log('Request $', statusCode, payloadString);
            console.log('Request $', trimmedPath, method);
            console.log('Request $', queryStringObject, headers);
        });
    });
};

// Define handler
const handlers = {};

// Sample handler
handlers.sample = (data, cb) => {
    // Callback a http status code and a payload object
    cb(406, { 'name': 'Sample Handler'});
};
// 404 handler
handlers.notFound = (data, cb) => {
    cb(404, { 'name': '404 Handler'});
};


// Define a request handler
const router = {
    'sample': handlers.sample,
    'notFound': handlers.notFound
};
