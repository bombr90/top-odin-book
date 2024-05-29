// config > passport.cjs
console.log("Loading config > passport.cjs");
require("dotenv").config();
const LocalStrategy = require('passport-local');
const bcrypt = require("bcryptjs");
const Auth = require("../models/auth.js")

module.exports = function (passport) {
console.log("loading auth > passport.js");

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(async function (_id, done) {
    try {
      const authObj = await Auth.findById(_id, {
        role: 1,
        email: 1,
      });
      console.log('deserialize authobj\n',authObj);
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
            // return done(null, false, { message: "Invalid email (passport)" });
          }
          // if (typeof authObj.local === "undefined") {
          //   return done(null, false, {
          //     message: "Local object does not exist (passport)",
          //   });
          // }
          bcrypt.compare(password, authObj.local.password, (err, res) => {
            if (res) {
              // success return user id
              return done(null, { id: authObj._id.toString() } );
            } else {
              // passwords !match
                return done(new Error("Incorrect password"));

              // return done(null, false, {
              //   message: "Incorrect password (auth)",
              //   email: email,
              // });
            }
          });
        } catch (err) {
          return done(err);
        }
      }
    )
  );
}
