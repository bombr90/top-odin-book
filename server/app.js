// import express from "express";
// import "./db.js";
// import session  from "express-session";
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import createError from "http-errors";
// import { fileURLToPath } from "url";
// import path from "path";
// import passport from "passport";

const express = require("express");
import('./db.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
// const fileURLToPath = require("url");
const path = require('path');
const crypto = require("crypto")
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const port = process.env.SERVER_PORT || '5000';
const clientPort = process.env.CLIENT_PORT || '3000';
const app = express();
const passport = require("passport");
const session = require("express-session");

app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: `http://localhost:${clientPort}`
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session Setup
app.use(
  session({
    secret: 'cat'
    // secret: process.env.SECRET || crypto.randomBytes(64).toString("hex"),
    // resave: false,
    // saveUninitialized: true,
    // cookie: { maxAge: 15 * 60 * 1000 }, // 15m
  })
);

// Passport configure and Initialization
require("./auth/passport.js")(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function(req,res,next){
  console.log('res.locals.currentUser',res.locals.currentUser, "req.user",req.user)
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