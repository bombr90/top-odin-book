const User = require("../models/user.js");
const Post = require("../models/post.js");
const Comment = require("../models/comment.js");

const { default: mongoose } = require("mongoose");

//  Middleware
const validateParamId = function (req, res, next) {
  if (mongoose.isValidObjectId(req.params.id)) {
    return next();
  } else {
    return res.json({
      path: req.originalUrl,
      message: `Invalid _id parameter`,
      id: req.params.id,
    });
  }
};

//  Helper
const limitPostUserFriends = async (req, post) => {
  const isAuthor = post.author.equals(req.user._id);
  let isFriend;
  if (!isAuthor) {
    const userFriends = await User.findById(req.user._id, "friends");
    isFriend = userFriends.friends.indexOf(post.author.id) !== -1;
  }
  return isAuthor || isFriend;
};

//Controllers
const getUserData = async function (req, res) {
  const user = await User.findById(
    req.user.id,
    "firstName lastName displayName email avatar"
  ).lean();
  res.json({ path: req.originalUrl, user });
};

const getPostIndex = async function (req, res) {
  // Get list of user timeline page (user and friends summary posts)

  const user = await User.findById(req.user._id, "friends").lean();
  const postCount = await Post.countDocuments({
    author: { $in: [user._id, ...user.friends] },
  });
  const limit = Math.max(1, Math.min(25, parseInt(req.query.limit) || 5));
  const maxPage = Math.ceil(postCount / limit);
  const page = Math.max(0, Math.min(maxPage, parseInt(req.query.page) || 0));

  const posts = await Post.find({
    author: { $in: [user._id, ...user.friends] },
  })
    .sort({ created: -1 })
    .skip(limit * page)
    .limit(limit)
    .populate({
      path: "author",
      select: "avatar displayName",
    })
    .populate({
      path: "commentCount",
    })
    .exec();

  res.json({
    path: req.originalUrl,
    data: { posts, limit, page, postCount, maxPage },
  });
};

const deleteComment = async function (req, res) {
  // User (author) deletes one existing comment
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({
      path: req.originalUrl,
      error: "Comment does not exist",
    });
  }
  if (!comment.author.equals(req.user._id)) {
    return res.status(401).json({
      path: req.originalUrl,
      error: "Not authorized to delete this comment.",
    });
  }
  const deleteCount = await Comment.deleteOne({ _id: req.params.id });

  res.json({
    path: req.originalUrl,
    comment,
    deleteCount,
  });
};

const postComment = async function (req, res) {
  // User or user's friend creates new comment
  const post = await Post.findById(req.params.id).populate({
    path: "author",
  });
  if (!post) {
    return res.status(404).json({
      path: req.originalUrl,
      error: "Post does not exist",
    });
  }
  //  Check that user is author or friend of author
  const pass = await limitPostUserFriends(req, post);
  if (!pass) {
    return res.status(401).json({
      path: req.originalUrl,
      error: "Not authorized to comment on this post.",
    });
  }
  const newCommentData = {
    postId: req.params.id,
    author: req.user._id,
    content: req.body.content,
  };
  //  Create new Comment object and save
  const newComment = new Comment(newCommentData);
  const comment = await newComment.save();
  res.json({
    path: req.originalUrl,
    comment,
  });
};

const postPost = async function (req, res) {
  // User creates new post
  const newPostData = { author: req.user.id, content: req.body.content };
  const newPost = new Post(newPostData);
  const post = await newPost.save();
  return res.json({
    path: `${req.originalUrl}`,
    data: post,
  });
};

const putPostLike = async function (req, res) {
  //User updates likes/unlikes of a post
  const post = await Post.findById(req.params.id, "likes").populate({
    path: "author",
  });
  if (!post) {
    return res.status(404).json({
      path: req.originalUrl,
      error: "Post does not exist",
    });
  }
  //  Check that user is author or friend of author
  const pass = await limitPostUserFriends(req, post);
  if (!pass) {
    return res.status(401).json({
      path: req.originalUrl,
      error: "Not authorized to like this post.",
    });
  }

  let postLikes;
  const options = {
    new: true,
    projection: "likes",
  };

  if (post.likes.indexOf(req.user.id) === -1) {
    postLikes = await Post.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user.id } },
      options
    );
  } else {
    postLikes = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user.id } },
      options
    );
  }
  res.json({
    path: req.originalUrl,
    postLikes: postLikes,
  });
};

const getPostDetails = async function (req, res) {
  // Get detailed post and comment thread (user/friend limited)
  const post = await Post.findById(req.params.id)
    .populate({
      path: "author",
      select: "avatar displayName",
    })
    .populate({
      path: "comments",
      populate: {
        path: "author",
        select: "displayName avatar",
      },
    })
    .populate({
      path: "commentCount",
    });
  if (!post) {
    return res.status(404).json({
      path: req.originalUrl,
      error: "Post does not exist",
    });
  }
  //  Check that user is author or friend of author
  const pass = await limitPostUserFriends(req, post);
  if (!pass) {
    return res.status(401).json({
      path: req.originalUrl,
      error: "Not authorized to read this post.",
    });
  }

  res.json({
    path: req.originalUrl,
    data: { post },
  });
};

const deletePost = async function (req, res) {
  // User deletes post and associated comments
  const post = await Post.findById(req.params.id).populate({
    path: "comments",
    select: "_id",
  });

  if (!post) {
    return res.status(404).json({
      path: req.originalUrl,
      error: "Post does not exist",
    });
  }
  if (!post.author.equals(req.user._id)) {
    return res.status(401).json({
      path: req.originalUrl,
      error: "Not authorized",
    });
  }
  const deletePostCount = await Post.deleteOne({ _id: req.params.id });
  const deleteCommentCount = await Comment.deleteMany({
    postId: req.params.id,
  });

  res.json({
    path: req.originalUrl,
    post,
    deletePostCount,
    deleteCommentCount,
  });
};

const getUserIndex = async function (req, res) {
  // Index of all Odinbook users. Traverse list (sorted by friend/received request/sent request
  //  Set valid pagination variables
  const userCount = await User.count();
  const limit = Math.max(1, Math.min(25, parseInt(req.query.limit) || 10));
  const maxPage = Math.ceil(userCount / limit);
  const page = Math.max(0, Math.min(maxPage, parseInt(req.query.page) || 0));
  //  Get limited user records and sort
  const userId = new mongoose.Types.ObjectId(req.user._id);
  const users = await User.aggregate([
    {
      $match: { _id: { $nin: [userId] } },
    },
    {
      $project: {
        displayName: 1,
        avatar: 1,
        isFriend: { $in: [req.user._id, "$friends"] },
        isRequester: { $in: [userId, "$friendsRequests.requester"] },
        isRecipient: { $in: [userId, "$friendsRequests.recipient"] },
      },
    },
    {
      $sort: {
        isFriend: -1,
        isRecipient: -1,
        isRequester: -1,
        displayName: 1,
      },
    },
    {
      $skip: limit * page,
    },
    {
      $limit: limit,
    },
  ]);
  res.json({
    path: req.originalUrl,
    data: {
      users,
      limit,
      page,
      userCount,
      maxPage,
    },
  });
};

const getUserProfile = async function (req, res) {
  // Get user profile (profile info, photo and posts if friend/user)
  const userFriends = await User.findById(req.user._id, "friends");
  const isFriend = userFriends.friends.indexOf(req.params.id);
  const isUser = req.user.id === req.params.id;
  let userData;
  if (isUser || isFriend !== -1) {
    userData = await User.findById(
      req.params.id,
      "avatar firstName lastName displayName posts updated created"
    ).populate({ path: "posts" });
  } else {
    userData = await User.findById(
      req.params.id,
      "avatar firstName lastName displayName updated created"
    );
  }

  if (!userData) {
    return res.status(404).json({
      path: req.originalUrl,
      error: "User does not exist",
    });
  }
  res.json({
    path: req.originalUrl,
    data: userData,
  });
};

const postFriendsRequest = async function (req, res) {
  // Send friend request
  const requesterId = req.user._id;
  const recipientId = req.body.friendId;
  // validate IDs
  if (
    !mongoose.isValidObjectId(requesterId) ||
    !mongoose.isValidObjectId(recipientId)
  ) {
    return res.json({ message: "Invalid reference" });
  }
  //  Check users exists
  const requester = await User.findById(requesterId, "friends friendsRequests");
  if (!requester) {
    return res.json({
      message: "requester does not exist",
      requesterId: requesterId,
    });
  }

  const recipientExists = await User.exists({ _id: recipientId });
  if (!recipientExists) {
    return res.json({
      message: "recipient does not exist",
      recipientId: recipientId,
    });
  }
  // check if already friend or request is outstanding
  if (requester.friends.includes(recipientId)) {
    return res.json({
      message: "recipient already friend",
      recipientId: recipientId,
    });
  }
  const existingRequest = requester.friendsRequests.find(
    (el) =>
      (el.recipient.equals(recipientId) && el.requester.equals(requesterId)) ||
      (el.recipient.equals(requesterId) && el.requester.equals(recipientId))
  );
  if (existingRequest) {
    return res.json({
      message: "request to be friend already exists",
      recipientId: recipientId,
      existingRequest,
    });
  }

  // Create new friends request
  const newRequest = {
    requester: requesterId,
    recipient: recipientId,
    status: "pending",
  };
  // Update two documents (use transactions for future refactor)
  const options = {
    new: true,
    projection: "friendsRequests",
    lean: true,
  };
  const requesterFriendsRequests = await User.findByIdAndUpdate(
    requesterId,
    { $addToSet: { friendsRequests: newRequest } },
    options
  );
  const recipientFriendsRequests = await User.findByIdAndUpdate(
    recipientId,
    { $addToSet: { friendsRequests: newRequest } },
    options
  );
  res.json({
    path: req.originalUrl,
    success: true,
    requesterFriendsRequests,
    recipientFriendsRequests,
  });
};

const deleteFriendsRequest = async function (req, res) {
  // Delete friend request
  const requesterId = req.user._id;
  const recipientId = req.body.friendId;
  // validate IDs
  if (
    !mongoose.isValidObjectId(requesterId) ||
    !mongoose.isValidObjectId(recipientId)
  ) {
    return res.json({ message: "Invalid reference" });
  }
  //  validate valid userIDs
  const requester = await User.findById(requesterId, "friendsRequests");
  if (!requester) {
    return res.json({
      message: "requester does not exist",
      requesterId: requesterId,
    });
  }

  const recipientExists = await User.exists({ _id: recipientId });
  if (!recipientExists) {
    return res.json({
      message: "recipient does not exist",
      recipientId: recipientId,
    });
  }
  // check if request is outstanding
  const existingRequest = requester.friendsRequests.find(
    (existingRequest) =>
      existingRequest.recipient.equals(recipientId) ||
      existingRequest.requester.equals(recipientId)
  );
  if (existingRequest) {
    // Update two documents (use transactions for future refactor)
    const options = {
      new: true,
      projection: "friendsRequests",
      lean: true,
    };
    const requesterFriendsRequests = await User.findByIdAndUpdate(
      requesterId,
      { $pull: { friendsRequests: existingRequest } },
      options
    );
    const recipientFriendsRequests = await User.findByIdAndUpdate(
      recipientId,
      { $pull: { friendsRequests: existingRequest } },
      options
    );
    return res.json({
      path: req.originalUrl,
      requesterFriendsRequests: requesterFriendsRequests,
      recipientFriendsRequests: recipientFriendsRequests,
    });
  } else {
    return res.json({
      path: req.originalUrl,
      existingRequest: existingRequest,
    });
  }
};

const putFriendsRequest = async function (req, res) {
  // Accept/reject request
  const userId = req.user.id;
  const friendId = req.body.friendId;
  const requestStatus = req.body.requestStatus;

  // validate IDs
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(friendId)
  ) {
    return res.json({ message: "Invalid reference" });
  }
  //  validate valid userIDs
  const user = await User.findById(userId, "friendsRequests");
  if (!user) {
    return res.json({
      message: "requester does not exist",
      userId: userId,
    });
  }

  const friendExists = await User.exists({ _id: friendId });
  if (!friendExists) {
    return res.json({
      message: "friendId does not exist",
      friendId: friendId,
    });
  }
  const existingRequest = await user.friendsRequests.find((el) => {
    return el.recipient.equals(userId) && el.requester.equals(friendId);
  });

  if (existingRequest) {
    // Update two documents (use transactions for future refactor)
    const options = {
      new: true,
      projection: "friends friendsRequests",
      lean: true,
    };
    if (requestStatus === true) {
      const userFriendsRequests = await User.findByIdAndUpdate(
        userId,
        {
          $addToSet: { friends: friendId },
          $pull: { friendsRequests: existingRequest },
        },
        options
      );
      const friendFriendsRequests = await User.findByIdAndUpdate(
        friendId,
        {
          $addToSet: { friends: userId },
          $pull: { friendsRequests: existingRequest },
        },
        options
      );
      return res.json({
        path: req.originalUrl,
        userFriendsRequests: userFriendsRequests,
        friendFriendsRequests: friendFriendsRequests,
      });
    } else {
      const userFriendsRequests = await User.findByIdAndUpdate(
        userId,
        {
          $pull: { friendsRequests: existingRequest },
        },
        options
      );
      const friendFriendsRequests = await User.findByIdAndUpdate(
        friendId,
        {
          $pull: { friendsRequests: existingRequest },
        },
        options
      );
      return res.json({
        path: req.originalUrl,
        userFriendsRequests: userFriendsRequests,
        friendFriendsRequests: friendFriendsRequests,
      });
    }
  } else {
    return res.json({
      path: req.originalUrl,
      existingRequest,
    });
  }
};

const deleteFriend = async function (req, res) {
  // Remove friend from friendslist
  const userId = req.user.id;
  const friendId = req.body.friendId;
  // validate IDs
  if (
    !mongoose.isValidObjectId(userId) ||
    !mongoose.isValidObjectId(friendId)
  ) {
    return res.status(400).json({ message: "Invalid reference" });
  }

  //  validate valid userIDs
  const user = await User.findById(userId, "friends").lean();
  if (!user) {
    return res.status(404).json({
      message: "user does not exist",
      userId: userId,
    });
  }

  const friendExists = await User.exists({ _id: friendId });
  if (!friendExists) {
    return res.status(404).json({
      message: "friendId does not exist",
      friendId: friendId,
    });
  }
  const options = {
    new: true,
    projection: "friends",
    lean: true,
  };

  const userFriends = await User.findByIdAndUpdate(
    userId,
    {
      $pull: { friends: friendId },
    },
    options
  );
  const friendFriends = await User.findByIdAndUpdate(
    friendId,
    {
      $pull: { friends: userId },
    },
    options
  );
  res.json({
    path: req.originalUrl,
    userFriends,
    friendFriends,
  });
};

module.exports = {
  validateParamId,
  deleteComment,
  postComment,
  getPostIndex,
  getUserData,
  getPostDetails,
  postPost,
  putPostLike,
  deletePost,
  getUserIndex,
  getUserProfile,
  postFriendsRequest,
  deleteFriendsRequest,
  putFriendsRequest,
  deleteFriend,
};
