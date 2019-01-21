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
// Required data: id
// Optional data: none
tokens.GET = (data, cb) => {
    // Check that the id is valid
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                cb(200, tokenData);
            } else {
                cb(404);
            }
        });
    } else {
        cb(400, {error: 'Missing required field!'});
    }
}
// Tokens - PUT
// Required data: phone, and extend
// Optional data: none.
tokens.PUT = (data, cb) => {
    // Check that the phone is valid
    const id = typeof(data.payload.id) == 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim() : false;
    // Check for optional fields
    const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend === true ? data.payload.extend : false;

    if (id && extend) {
        // Lookup the user
        _data.read('tokens', id, (err, tokenData) => {
            if (!err && tokenData) {
                // Check to make sure that the token hasn't expired
                if (tokenData.expires > Date.now()) {
                    tokenData.expires = Date.now() + 1000 * 60 * 60;
                    // Store the new user data
                    _data.update('tokens', id, tokenData, err => {
                        if (!err) {
                            cb(200);
                        } else {
                            cb(500, {error: 'Could not update the token\'s expiration!'});
                        }
                    });
                } else {
                    cb(400, {error: 'The token has already expired and cannot be extended!'});
                }
            } else {
                cb(400, {error: 'The specified token does not exist!'});
            }
        });
    } else {
        cb(400, {error: 'Missing required field(s) of field(s) are invalid!'});
    }
};
// Tokens - DELETE
// Required data: id
// Optional data: none
tokens.DELETE = (data, cb) => {
    // Check that the id is valid
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim() : false;
    if (id) {
        _data.read('tokens', id, (err, data) => {
            if (!err && data) {
                _data.delete('tokens', id, err => {
                    if (!err) {
                        cb(200);
                    } else {
                        cb(404, {error: 'Could not delete the specified token!'});
                    }
                });
            } else {
                cb(404, {error: 'Could not find the specified token!'});
            }
        });
    } else {
        cb(400, {error: 'Missing required field!'});
    }
};

// Export all user methods
module.exports = tokens;