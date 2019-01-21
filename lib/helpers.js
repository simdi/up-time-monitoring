/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

/* Helpers for various tasks */

// Dependencies
const crypto = require('crypto');
const config = require('../config');
const _data = require('./data');

// Container for all the helper functions
const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
    if (typeof(str) == 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.secret).update(str).digest('hex');
    } else {
        return false;
    }
};

// Parse a json string to an object without throwing an error
helpers.parseJsonToObject = (str) => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
};
// Create a string of random alphanumeric characters of a given length
helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        // Define all the possible characters that could go into the string.
        const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        // Start the final string.
        let str = '';
        for(let i = 1; i <= strLength; i++) {
            // Get random string from the possible characters
            const randomChar = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append the character to the final string
            str += randomChar;
        }
        return str;
    } else {
        return false;
    }
}
// Verify if a given token id is currently valid for a given user
helpers.verifyToken = (id, phone, cb) => {
    // lookup the token
    _data.read('tokens', id, (err, tokenData) => {
        if (!err && tokenData) {
            // Check that the token is for the given user and has not expired.
            if (tokenData.phone == phone && tokenData.expires > Date.now()) {
                cb(true);
            } else {
                cb(false);
            }
        } else {
            cb(false);
        }
    });
};

// Export the module
module.exports = helpers;