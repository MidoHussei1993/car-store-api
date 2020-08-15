const winston = require("winston");
// require('winston-mongodb');
require("express-async-errors");

module.exports = function () {
  // winston.exceptions.handle( new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  // //

  // process.on('unhandledRejection', (ex) => {
  //   throw ex;
  // });

  // winston.add(winston.transports.File({ filename: 'logfile.log' }));
  // winston.add(winston.transports.MongoDB, {
  //   db: 'mongodb://localhost/vidly',
  //   level: 'info'
  // });
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true })
  );
  process.on("unhandledRejection", (ex) => {
    console.log(ex);
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));
};
