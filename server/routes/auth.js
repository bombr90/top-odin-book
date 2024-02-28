const express = require("express");
const createLocalUserData = require("../seed.js");
const User = require("../models/user.js");
const Auth = require("../models/auth.js")
const passport = require('passport');
const authController = require("./../controllers/authController.js");

const router = express.Router();
const {body, validationResult} = require("express-validator");

router.post("/user/local", async function (req, res) {
  // Create new Odinbook user after checking if user exists
  const newUser = new User(createLocalUserData());
  const newAuthContent = {
    _id: newUser._id,
    email: newUser.email,
    local: { email: newUser.email, password: "password" },
  };
  const newAuth = new Auth(newAuthContent);
  const auth = await newAuth.save();
  const user = await newUser.save();  
  res.json({ message: `post'/user' path: ${req.baseUrl + req.path}`, user: user, auth: auth });
});

router.get("/login", function (req, res) {
  // User privacy wall (login modal) or Timeline/feed
  console.log('session:',req.session)
  res.json({ message: `get'/' path: ${req.baseUrl + req.path}` });
});

router.post(
  "/login/local",
  body("email", "Email required").trim().isEmail().escape(),
  body("password", "Password required").trim().notEmpty(),
  async (req, res, next) => {
    const result = validationResult(req);
    if(!result.isEmpty()){
      return res.status(400).json({errors: result.array()});
    }
    next();
  },
  passport.authenticate("local", { 
    // successRedirect: '/',
    // failureRedirect: "/auth/v1/login" 
  }),
  function (req, res) {
    console.log('loggedin req.session\n',req.session)
    res.json({ message: "successful login", user: req.user, session: req.session, isAuthenticated: req.isAuthenticated() });
  }
);

router.post("/login/facebook", function (req, res) {
  // Authenticate login credentials via passport facebook authentication, if user exist add email to user database to avoid duplicates
  res.json({ message: `post'/user/login' path: ${req.baseUrl + req.path}` });
});

router.post(
  "/logout",
  function(req,res, next) {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      return res.json({
        message: "logout (auth)",
        user: req.user || "no user",
        session: req.session,
      });
      // return res.redirect('/auth/v1/login');
    });
    }
  );

router.get("/test", authController.loggedIn, function (req, res) {
  res.json({ message: "User currently logged in" });
});

module.exports = router;
