/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

/* Helpers for various tasks */

// Dependencies
const crypto = require('crypto');

// Container for all the helper functions
const helpers = {};

// Create a SHA256 hash
helpers.hash = (str) => {
    if (typeof(str) == 'string' && str.length > 0) {
        return crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    } else {
        return false;
    }
};

// Export the module
module.exports = helpers;