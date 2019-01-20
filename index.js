/*
* @author: Chisimdi Damian Ezeanieto
* @date: 20/01/2019
*/
// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const port = process.env.PORT || 3000;

// The server should respond to all requests with a string.
const server = http.createServer((req, res) => {
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
        // Send the response
        res.end('Hello World\n');

        // Log the path of the request
        console.log('Request $', trimmedPath, method);
        console.log('Request $', queryStringObject, headers);
    });
});

// Start the server and have it listen to the port specified.
server.listen(port, _=> {
    console.log(`Server is listening on port ${port}`);
});

