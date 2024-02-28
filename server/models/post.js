const mongoose = require("mongoose");
const model = mongoose.model;
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trimmed: true,
    },
    likes: [
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

PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
});

PostSchema.virtual("commentCount", {
  ref: "Comment",
  localField: "_id",
  foreignField: "postId",
  count: true,
});

PostSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

module.exports = model("Post", PostSchema);