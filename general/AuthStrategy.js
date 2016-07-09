module.exports = loginUser;

var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var async = require('async');

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
      switchDb.bind(null, sack),
      checkDb.bind(null, sack),
      authenticateAcc.bind(null, sack)
    ],
    function(err) {
      if(err){
        return done(null, false, {message: "Incorrect Username or Password"});
      }
      logs.info('Successfully authenticated user');
      return done(null, username);
    }
  );
}

function switchDb(sack, next) {
  global.client.select(1, function(err, intr) {
    if(err) {
      return next('DB NOT FOUND');
    }
    next();
  });
}
function checkDb(sack, next) {
  global.client.get(sack.username, function(err, passToken) {
    if(err) {
      logs.error('Error finding id', sack.username);
      return next(err);
    } else if(!passToken) {
      logs.error('ID %s was not found.', sack.username);
      return next(err);
    } else {
      logs.info('ID %s was found.', sack.username);
      sack.passToken = passToken;
      next();
    }
  });
}

function authenticateAcc(sack, next) {
  if (!sack.passToken) {
    logs.error('ID %s was not found.', sack.username);
    return next('ID was not found')
  }
  if (sack.passToken === sack.password) {
    next();
  } else {
    return next('password Incorrect');
  }
}
