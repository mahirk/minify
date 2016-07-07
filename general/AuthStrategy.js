'use strict'

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var async = require('async');
module.exports = loginUser;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

function loginUser() {
  passport.use('local', new LocalStrategy(authUser));
}

function authUser(username, password, done) {
  var sack = {
    username: username,
    password: password
  }
  async.series([
      checkDb.bind(null, sack),
      authenticateAcc.bind(null, sack)
    ],
    function(err) {
      if(err){
        return done(null, false, {message: "Incorrect Username or Password"});
      }
      logs.info('Successfully authenticated user',);
      return done(null, username);
    }
  );
}

function checkDb(sack, next) {
  global.client.get(sack.username, function(err, passToken) {
    if(err) {
      logs.error('Error finding id', sack.username);
      return next(err);
    } else if(!redirectObject) {
      logs.error('ID %s was not found.', sack.username);
      return next(err);
    } else {
      sack.passToken = passToken;
      next();
    }
  });
}

function authenticateAcc(sack, next) {
  if (!sack.passToken) {
    return next('ID was not found')
  }
  if (sack.passToken === sack.password) {
    next();
  } else {
    return next('password Incorrect');
  }
}
