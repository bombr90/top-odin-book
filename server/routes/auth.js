const express = require("express");
const passport = require("passport");
const {
  checkAuth,
  deleteUser,
  getLogin,
  postUserLocal,
} = require("./../controllers/authController.js");
const { registerRules, loginRules, validate } = require("./../validator.js");
const router = express.Router();
const asyncHandler = require("express-async-handler");

// *** Test route and imports for automatically creating dummy users, comment out existing router.post(/use/local...) and use Postman or similar for pushing request  ***
// const createLocalUserData = require("../seed.js");
// const User = require("../models/user.js");
// const Auth = require("../models/auth.js");
// router.post("/user/local", async function (req, res) {
//   // Create new Odinbook user after checking if user exists
//   const newUser = new User(createLocalUserData());
//   const newAuthContent = {
//     _id: newUser._id,
//     email: newUser.email,
//     local: { email: newUser.email, password: "password" },
//   };
//   const newAuth = new Auth(newAuthContent);
//   const auth = await newAuth.save();
//   const user = await newUser.save();
//   res.json({ path: req.originalUrl, user: user, auth: auth });
// });

router.post(
  "/user/local",
  registerRules(),
  validate,
  asyncHandler(postUserLocal)
);

router.get("/login", checkAuth, asyncHandler(getLogin));

router.post(
  "/login/local",
  loginRules(),
  validate,
  passport.authenticate("local"),
  function (req, res) {
    res.json({ path: req.originalUrl, user: req.user });
  }
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    return res.json({
      path: req.originalUrl,
      user: res.user,
      session: res.session,
    });
  });
});

router.delete("/user", checkAuth, asyncHandler(deleteUser));

module.exports = router;
