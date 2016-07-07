'use strict';

module.exports = CallErr;
global.CallErr = CallErr;

// API call errors
CallErr.ParamNotFound = 1000;
CallErr.CallerUserNotFound = 1002;
CallErr.DataNotFound = 1003;
CallErr.OperationFailed = 1005;
CallErr.ApiServerError = 1107;
CallErr.DBOperationFailed = 2200;
CallErr.DBEntityNotFound = 2000;
CallErr.InvalidParam = 5000;
CallErr.MissingRoutePerm = 10;
CallErr.InternalServer = 99;


function CallErr(method, id, message, error) {
  this.id = id || CallErr.InternalServer;
  this.message = message;
  this.method = method;
  logs.error(id, method + ' | ' + message);
}
