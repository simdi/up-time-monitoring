/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/
// Define handler
const handlers = {};
// Ping handler
// This route is to check if an application is up or not
handlers.ping = (data, cb) => {
    // Callback a http status code and a payload object
    cb(406, { 'name': 'Sample Handler'});
};
// 404 handler
handlers.notFound = (data, cb) => {
    cb(404, { 'name': '404 Handler'});
};
// Export a request handler
module.exports = {
    'ping': handlers.ping,
    'notFound': handlers.notFound
};