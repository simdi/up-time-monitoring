/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

/* Create and export configuration variables */

// Container for all the environment
const environments = {};
// Staging (default) environment
environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    secret: '1234567890abcedf',
    twilio: {
        accountSid: '',
        'authToken': '',
        'fromPhone': ''
    },
    maxChecks: 5
};
// Production environment
environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    secret: '1234567890abcedf',
    twilio: {
        accountSid: '',
        'authToken': '',
        'fromPhone': ''
    },
    maxChecks: 5
};
// Determine which environment was passed as a command-line argument.
const currentENV = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
// Check that the current environment is one of the environments above, if not, default to statging.
const environmentToExport = typeof(environments[currentENV]) == 'object' ? environments[currentENV] : environments.staging;
// Export the module
module.exports = environmentToExport;