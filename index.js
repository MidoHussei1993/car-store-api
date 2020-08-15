const winston = require('winston');
const express = require('express');
const config = require('config')
const app = express();

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));


module.exports = server;
// console.log(config.get('host'))
// console.log('i just get work')
// console.log(config.get('Customer.jwtPrivateKey'))
// console.log(config.util.getEnv('Customer.jwtPrivateKey'))
// console.log('NODE_ENV: ' + config.util.getEnv('NODE_ENV'));
// console.log('NODE_ENV: ' + config.util.getEnv('Customer.jwtPrivateKey'));