// config > passport.cjs
require("dotenv").config();
const LocalStrategy = require('passport-local');
const bcrypt = require("bcryptjs");
const Auth = require("../models/auth.js")

module.exports = function (passport) {

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (_id, done) {
    try {
      const authObj = await Auth.findById(_id, {
        role: 1,
        email: 1,
      });
      done(null, authObj);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const authObj = await Auth.findOne({ email: email },{local: 1});
          if (!authObj) {
            return done(new Error("Invalid email"));
          }
          bcrypt.compare(password, authObj.local.password, (err, res) => {
            if (res) {
              // success return user id
              console.log('successful login', authObj._id.toString())
              return done(null, { id: authObj._id.toString() } );
            } else {
              // passwords !match
              console.log('failed login attempt', authObj._id.toString())
                return done(null, false, new Error("Incorrect password"));
            }
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}
