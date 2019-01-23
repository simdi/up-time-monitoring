/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

// Dependencies
const _users = require('./services/users');
const _tokens = require('./services/tokens');
const _checks = require('./services/checks');
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
        _users[data.method](data, cb);
    } else {
        cb(405);
    }
};
// Tokens
router.tokens = (data, cb) => {
    const acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        _tokens[data.method](data, cb);
    } else {
        cb(405);
    }
};
// Checks
router.checks = (data, cb) => {
    const acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        _checks[data.method](data, cb);
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
    'checks': router.checks,
    'notFound': router.notFound
};