const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/employeeSchema');

// Configure Local Strategy for authentication
passport.use(
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async function (req, email, password, done) {
        try {
          const user = await User.findOne({ email }).exec();
  
          if (!user || user.password !== password) {
            console.log(`Invalid Credentials`);
            return done(null, false);
          }
          return done(null, user); // Pass the user object to indicate successful authentication
        } catch (error) {
          console.log(`Error in finding employee: ${error}`);
          return done(error);
        }
      }
    )
  );

// Serialize user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async function (id, done) {
    try {
      const user = await User.findById(id).exec();
  
      if (!user) {
        console.log(`Error in finding user -> passport`);
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      console.log(`Error in finding user -> passport: ${error}`);
      return done(error);
    }
  });
  
// Check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/employee/signin');
};

// Check for admin access
passport.checkAdmin = function (req, res, next) {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  console.log(`Employees are not allowed to access this resource`);
  return res.redirect('back');
};

// Set authenticated user for views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
