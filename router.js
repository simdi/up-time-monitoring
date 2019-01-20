/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/
// Dependencies
const _data = require('./lib/data');
const helpers = require('./lib/helpers');

// Define handler
const handlers = {};
// Ping handler
// This route is to check if an application is up or not
handlers.ping = (data, cb) => {
    // Callback a http status code and a payload object
    cb(406, { 'name': 'Sample Handler'});
};
// Users
handlers.users = (data, cb) => {
    const acceptableMethods = ['POST', 'GET', 'PUT', 'DELETE'];
    if (acceptableMethods.indexOf(data.method) > -1) {
        handlers._users[data.method](data, cb);
    } else {
        cb(405);
    }
};

// Container for the users sub methods
handlers._users = {};
// Users - POST
// Required fields: firstName, lastName, phone, password, tosAgreement
// Optional data: none.
handlers._users.POST = (data, cb) => {
    // Check that all required fields are filled out.
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
    const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Make sure that the user doesn't already exist.
        _data.read('users', phone, (err, data) => {
            if (err) {
                // Hash the user's password.
                const hashedPassword = helpers.hash()
            } else {
                cb(400, { 'error': 'User with the phone already exist.'})
            }
        });
    } else {
        cb(400, { 'error': 'Missing required fields' });
    }
}
// Users - GET
handlers._users.GET = (data, cb) => {

}
// Users - PUT
handlers._users.PUT = (data, cb) => {

}
// Users - DELETE
handlers._users.DELETE = (data, cb) => {

}

// 404 handler
handlers.notFound = (data, cb) => {
    cb(404, { 'name': '404 Handler'});
};
// Export all request handlers
module.exports = {
    'ping': handlers.ping,
    'users': handlers.users,
    'notFound': handlers.notFound
};