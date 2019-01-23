/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

// Dependencies
const config = require('../config');
const _data = require('../lib/data');
const helpers = require('../lib/helpers');

// Container for the tokens sub methods
checks = {};
// Checks - POST
// Required fields: protocol, url, method, successCodes, timeoutSeconds
// Optional data: none.
checks.POST = (data, cb) => {
    // Check that all required fields are filled out.
    const protocol = typeof(data.payload.protocol) == 'string' && ['https', 'https'].indexOf(data.payload.protocol) > -1 ? data.payload.protocol.trim() : false;
    const url = typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim() : false;
    const method = typeof(data.payload.method) == 'string' && ['post', 'get', 'put', 'delete'].indexOf(data.payload.method) > -1 ? data.payload.method.trim() : false;
    const successCodes = typeof(data.payload.successCodes) == 'object' && data.payload.successCodes instanceof Array && data.payload.successCodes.length > 0 ? data.payload.successCodes : false;
    const timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 === 0 && data.payload.timeoutSeconds <= 5 ? data.payload.timeoutSeconds : false;
    
    if (protocol && url && method && successCodes && timeoutSeconds) {
        // Get the token from the headers
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false;
        // Verify that the given token is valid for the phone.
        _data.read('tokens', token, (err, tokenData) => {
            if (!err && tokenData) {
                const phone = tokenData.phone;
                // Lookup the user.
                _data.read('users', phone, (err, userData) => {
                    if (!err && userData) {
                        const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                        // Verify that the user has less than the number of max checks per user.
                        if (userChecks.length < config.maxChecks) {
                            // Create random id for the checks
                            const checkId = helpers.createRandomString(20);
                            // Create the check object and include the user's phone.
                            const checkObject = { id: checkId, userPhone: phone, protocol, url, method, successCodes, timeoutSeconds };
                            console.log('CheckObjecg', checkObject);
                            // Save the object.
                            _data.create('checks', checkId, checkObject, (err) => {
                                if (!err) {
                                    // Add the checkId to the user's object.
                                    userData.checks = userChecks;
                                    userData.checks.push(checkId);
                                    _data.update('users', phone, userData, (err) => {
                                        if (!err) {
                                            cb(200, checkObject);
                                        } else {
                                            cb(500, { 'error': 'Could not update the user with the new check'});
                                        }
                                    });
                                } else {
                                    cb(500, { 'error': 'Could not create a new check' });
                                }
                            });
                        } else {
                            cb(400, { 'error': `The user already has the maximum number of checks ${config.maxChecks}` });
                        }
                    } else {
                        cb(403, { 'error': 'Unauthorized' });
                    }
                });
            } else {
                cb(405, { 'error': 'Missing required token in header, or token is invalid' });
            }
        });
    } else {
        cb(400, { 'error': 'Missing required fields, or inputs are invalid' });
    }
};


// Export all user methods
module.exports = checks;