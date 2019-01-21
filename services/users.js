/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

// Dependencies
const _data = require('../lib/data');
const helpers = require('../lib/helpers');

// Container for the users sub methods
users = {};
// Users - POST
// Required fields: firstName, lastName, phone, password, tosAgreement
// Optional data: none.
users.POST = (data, cb) => {
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
                const hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    // Create user object
                    const userObject = { firstName, lastName, phone, hashedPassword, tosAgreement: true };
                    // Save user data;
                    _data.create('users', phone, userObject, (err) => {
                        if (!err) {
                            cb(200);
                        } else {
                            console.log('Error', err);
                            cb(400, {error: 'Could not create the new user'});
                        }
                    });
                } else {
                    cb(500, {error: 'Could not hash user\'s password'});
                }
            } else {
                cb(400, {error: 'User with the phone already exist.'})
            }
        });
    } else {
        cb(400, { 'error': 'Missing required fields' });
    }
}
// Users - GET
// Required data: phone
// Optional data: none
// @TODO Only let users that are authenticated to access their own data
users.GET = (data, cb) => {
    // Check that the phone is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        // Get the token from the headers
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for the phone.
        helpers.verifyToken(token, phone, (valid) => {
            if (valid) {
                _data.read('users', phone, (err, data) => {
                    if (!err && data) {
                        // Remove the hashed password from the data object before sending it back to the requester.
                        delete data.hashedPassword;
                        cb(200, data);
                    } else {
                        cb(404);
                    }
                });
            } else {
                cb(405, 'Token is not valid for the user');
            }
        });
    } else {
        cb(400, {error: 'Missing required field!'});
    }
}
// Users - PUT
// Required data: phone
// Optional data: firstName, lastName, password (at least one field must be specified).
users.PUT = (data, cb) => {
    // Check that the phone is valid
    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    // Check for optional fields
    const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
    const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone) {
        // Error if nothing is sent to update
        if (firstName || lastName || password) {
            // Lookup the user
            _data.read('users', phone, (err, userData) => {
                if (!err && userData) {
                    // Update the fields necessary
                    if (firstName) {
                        userData.firstName = firstName;
                    }
                    if (lastName) {
                        userData.lastName = lastName;
                    }
                    if (password) {
                        userData.hashedPassword = helpers.hash(password);
                    }
                    // Store the new user data
                    _data.update('users', phone, userData, err => {
                        if (!err) {
                            cb(200);
                        } else {
                            cb(500, {error: 'Could not update the user!'});
                        }
                    })
                } else {
                    cb(400, {error: 'The specified user does not exist!'});
                }
            });
        } else {
            cb(400, {error: 'Missing fields to update!'});
        }
    } else {
        cb(400, {error: 'Missing required field!'});
    }
};
// Users - DELETE
// Required data: phone
// Optional data: none
users.DELETE = (data, cb) => {
    // Check that the phone is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
        _data.read('users', phone, (err, data) => {
            if (!err && data) {
                _data.delete('users', phone, err => {
                    if (!err) {
                        cb(200);
                    } else {
                        cb(404, {error: 'Could not find the specified user!'});
                    }
                });
            } else {
                cb(404, {error: 'Could not find the specified user!'});
            }
        });
    } else {
        cb(400, {error: 'Missing required field!'});
    }
};

// Export all user methods
module.exports = users;