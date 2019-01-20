/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

// Dependencies
const users = require('./services/users');
const tokens = require('./services/tokens');
// Define handler
const router = {};
// Ping handler
// This route is to check if an application is up or not
router.ping = (data, cb) => {
    // Callback a http status code and a payload object
    cb(406, { 'name': 'Sample Handler'});
};
// Users
router.users = (data, cb) => {
    const acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        users[data.method](data, cb);
    } else {
        cb(405);
    }
};
// Tokens
router.tokens = (data, cb) => {
    const acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        tokens[data.method](data, cb);
    } else {
        cb(405);
    }
};



// 404 handler
router.notFound = (data, cb) => {
    cb(404, { 'name': '404 Handler'});
};
// Export all request routers
module.exports = {
    'ping': router.ping,
    'users': router.users,
    'tokens': router.tokens,
    'notFound': router.notFound
};