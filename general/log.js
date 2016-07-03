var winston = require('winston');

var WinstonFileTransport = winston.transports.File,
    WinstonConsoleTransport = winston.transports.Console;

configLevel();

exports = winston;
module.exports = winston;
global.logs = winston;

exports.configLevel = configLevel;

function configLevel(config) {
  winston.clear();

  config = config || {};

  var logLevel = 'debug';
  if (config.runMode === 'beta') {
    logLevel = 'info';
  } else if (config.runMode === 'production') {
    logLevel = 'error';
  }

  winston.add(WinstonConsoleTransport, {
    timestamp: true,
    colorize: true,
    level: logLevel
  });

  winston.add(WinstonFileTransport, {
    name: 'file#out',
    timestamp: true,
    colorize: true,
    filename: 'logs/api_' + process.env.MODE + '_out.log',
    maxsize: 10485760,// maxsize: 10mb
    maxFiles: 20,
    level: logLevel,
    json: false
  });

  winston.add(WinstonFileTransport, {
    name: 'file#err',
    timestamp: true,
    colorize: true,
    filename: 'logs/api_' + process.env.MODE + '_err.log',
    maxsize: 10485760,// maxsize: 10mb
    maxFiles: 20,
    level: 'error',
    json: false
  });
}
