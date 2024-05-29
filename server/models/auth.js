const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const bcryptjs = require("bcryptjs");

const LocalSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      require: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { _id: false }
);

// const FacebookSchema = new Schema(
//   {
//     id: { type: String, required: true },
//     token: { type: String, required: true },
//     email: { type: String, required: true },
//     name: { type: String, required: true },
//   },
//   { _id: false }
// );

const AuthSchema = new Schema(
  {
    email: {
      type: String,
      minLength: 1,
      required: true,
      trim: true,
      unique: true,
    },
    local: LocalSchema,
    // facebook: FacebookSchema,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
  }
);

// future db password handling implementation for refactor https://www.mongodb.com/blog/post/password-authentication-with-mongoose-part-1

AuthSchema.pre("save", function (next) {
  const auth = this;
  if (!auth.local.isModified("password")) return next();
  bcryptjs.hash(auth.local.password, 10, function (err, hash) {
    if (err) return next(err);
    auth.local.password = hash;
    next();
  });
});

LocalSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcryptjs.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

module.exports = model("Auth", AuthSchema);
