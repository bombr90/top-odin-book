const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;

const FriendsRequestSchema = new Schema(
  {
    requester: { type: Schema.Types.ObjectId, required: true },
    recipient: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { _id: false }
);


const UserSchema = new Schema(
  {
    friendsRequests: [FriendsRequestSchema],
    displayName: {
      type: String,
      minLength: 1,
      maxLength: 32,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      minLength: 1,
      required: true,
      trim: true,
      unique: true,
    },
    avatar: {
      type: String,
      trim: true,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: {
      createdAt: "created",
      updatedAt: "updated",
    },
  },
);

UserSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  options: {sort: {created: -1}}
});

UserSchema.virtual("postCount", {
  ref: "Post",
  localField: "_id",
  foreignField: "author",
  count: true,
});

UserSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "author",
});

UserSchema.virtual("likes", {
  ref: "Post",
  localField: "_id",
  foreignField: "likes",
});

module.exports = model("User", UserSchema);
