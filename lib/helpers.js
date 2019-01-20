/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

/* Helpers for various tasks */

// Dependencies
const crypto = require('crypto');
const config = require('../config');

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

// Export the module
module.exports = helpers;