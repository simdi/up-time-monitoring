/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

/* Helpers for various tasks */

// Dependencies
const crypto = require('crypto');
const config = require('../config');
const https = require('https');

const queryString = require('querystring');

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

// Send an SMS message via Twilio
helpers.sendTwilioSms = (phone, msg, callback) => {
    // Validate parameters
    phone = typeof(phone) == 'string' && phone.trim().length === 11 ? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if (phone && msg) {
        // configure the request payload.
        const payload = {
            'From': config.twilio.fromPhone,
            'To': '+234' + phone,
            'Body': msg
        };

        // Stringify the payload
        const requestDetails = {
            'protocol': 'https:',
            'hostname': 'api.twilio.com',
            'method': 'POST',
            'path': `/2010-04-01/Accounts/${config.twilio.accountSid}/Messages.json`,
            'auth': `${config.twilio.accountSid}:${config.twilio.authToken}`,
            'headers': {
                'Content-type': 'application/x-www.form-urlencoded',
                'Content-Legnth': Buffer.byteLength(stringPayload)
            }
        }

        // Instantiate the request object.
        const req = https.request(requestDetails, (res) => {
            // Grab the status of the sent request.
            const status = res.statusCode;
            // Callback successfully if the request went through.
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`Status code returned was ${status}`);
            }
        });

        // Bind to the error event so it don't get thrown
        req.on('error', (e) => {
            callback(e);
        });

        // Add payload
        req.write(stringPayload);
        // End request
        req.end();
    } else {
        callback('Given parameters are missing or invalid.');
    }
}

// Export the module
module.exports = helpers;