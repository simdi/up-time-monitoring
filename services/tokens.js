/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

// Dependencies
const _data = require('../lib/data');
const helpers = require('../lib/helpers');

// Container for the tokens sub methods
tokens = {};
// Tokens - POST
// Required fields: phone, password
// Optional data: none.
tokens.POST = (data, cb) => {
    // Check that all required fields are filled out.
    const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
    const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;

    if (phone && password) {
        // Check the user that matches that phone
        _data.read('users', phone, (err, userData) => {
            if (!err && userData) {
                // Hash the user's password and compare it with the user object that has been saved.
                const hashedPassword = helpers.hash(password);
                if (hashedPassword === userData.hashedPassword) {
                    // If valid, create a new token with a random name, and set expiration date to one hour in the future.
                    const tokenId = helpers.createRandomString(20);
                    const expires = Date.now() + 1000 * 60 * 60;
                    const tokenObject = { phone, id: tokenId, expires };
                    // Save token data;
                    _data.create('tokens', tokenId, tokenObject, (err) => {
                        if (!err) {
                            cb(200, tokenObject);
                        } else {
                            console.log('Error', err);
                            cb(500, {error: 'Could not create the new token'});
                        }
                    });
                } else {
                    cb(500, {error: 'Password did not match the specified user\'s stored password.'});
                }
            } else {
                cb(500, {error: 'Could not find the specified user'});
            }
        });
    } else {
        cb(400, { 'error': 'Missing required fields' });
    }
}
// Tokens - GET
// Required data: phone
// Optional data: none
// @TODO Only let users that are authenticated to access their own data
tokens.GET = (data, cb) => {
    // Check that the phone is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
    if (phone) {
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
        cb(400, {error: 'Missing required field!'});
    }
}
// Tokens - PUT
// Required data: phone
// Optional data: firstName, lastName, password (at least one field must be specified).
tokens.PUT = (data, cb) => {
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
// Tokens - DELETE
// Required data: phone
// Optional data: none
tokens.DELETE = (data, cb) => {
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
module.exports = tokens;