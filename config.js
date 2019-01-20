/*
* @author: Chisimdi Damian Ezeanieto
* @date: 21/01/2019
*/

/* Create and export configuration variables */

// Container for all the environment
const environments = {};
// Staging (default) environment
environments.staging = {
    port: 3000,
    envName: 'staging'
};
// Production environment
environments.production = {
    port: 5000,
    envName: 'production'
};
// Determine which environment was passed as a command-line argument.
const currentENV = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';
// Check that the current environment is one of the environments above, if not, default to statging.
const environmentToExport = typeof(environments[currentENV]) == 'object' ? environments[currentENV] : environments.staging;
// Export the module
module.exports = environmentToExport;