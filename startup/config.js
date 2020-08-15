const config = require('config');

module.exports = function() {
  if (!config.get('Customer.jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  }
}