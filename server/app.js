const express = require("express");
import('./db.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const path = require('path');
const crypto = require("crypto")
const port = process.env.SERVER_PORT || '5000';
const clientPort = process.env.CLIENT_PORT || '3000';
const app = express();
const passport = require("passport");
const session = require("express-session");
const helmet = require("helmet");

app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    credentials: true,
    origin: [
      `http://localhost:${clientPort}`,
      `https://localhost:${clientPort}`,
      `https://top-odin-book-frontend.onrender.com`,
    ],
    allowedHeaders: ["Content-Type", "Accept", "Authorization", "Set-Cookie"],
    methods: ["GET", "PUT", "DELETE", "POST", "HEAD", "OPTIONS"],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session Setup
app.use(
  session({
    secret: process.env.SECRET || crypto.randomBytes(64).toString("hex"),
    resave: false,
    saveUninitialized: true,
    cookie: {
      sameSite: "none",
      secure: "auto",
      httpOnly: false,
      maxAge: 30 * 60 * 1000,
    }, // 30 minutes
  })
);

// Passport configure and Initialization
require("./auth/passport.js")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  next();
});

// Routes
const apiRouter = require("./routes/api.js");
const authRouter= require("./routes/auth.js");
const index = require("./routes/index.js");

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1", apiRouter);
app.use("/auth/v1", authRouter);
app.use("/api", index);
app.use("/", index);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({'error': err.message});
  next();
});

app.listen(port, () => {
  console.log("server listening on port: ", port);
  console.log("cors enabled for on port: ", clientPort);

});

module.exports = app;