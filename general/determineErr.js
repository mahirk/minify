'use strict';

global.throwErr = throwErr;


var errorMaps = {};

  errorMaps[CallErr.ParamNotFound] = [400, 'Required ParamNotFound'];
  errorMaps[CallErr.CallerUserNotFound] = [400, 'No Toek'];
  errorMaps[CallErr.DataNotFound] = [400, ];
  errorMaps[CallErr.OperationFailed] = [500, ];
  errorMaps[CallErr.ApiServerError] = [500, ];
  errorMaps[CallErr.DBOperationFailed] = [400, ];
  errorMaps[CallErr.DBEntityNotFound] = [404, ];
  errorMaps[CallErr.InvalidParam] = [409, ];
  errorMaps[CallErr.MissingRoutePerm] = [400, ];
  errorMaps[CallErr.InternalServer] = [500, ]

function throwErr(res, callErr){
  if(!callErr)
    callErr = CallErr.InternalServer;

  logs.debug(callErr);
  var errVal = errorMaps[callErr.id];
  res.status(errVal[0]).send(callErr);
}
