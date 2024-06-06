const User = require("../models/user.js");
const Auth = require("../models/auth.js");
const Post = require("../models/post.js");
const Comment = require("../models/comment.js");
const getGravatarUrl = require("../generate-gravatar.js");

//Middleware
const checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('authenticated')
    return next();
  } else {
    console.log('not authenticated')
    return res.status(401).json({ path: req.originalUrl, message: "Not authenticated" });
  }
};

const isAuthenticated = (req, res) => {
  console.log("req.isAuthenticated()", req.isAuthenticated());
  return res.json({ path: req.originalUrl, auth: req.isAuthenticated() });
};

//Controllers
const getLogin = async (req, res) => {
  res.json({ path: req.originalUrl });
};
const postUserLocal = async (req, res) => {
  // Create new Odinbook user after checking if user userExists
  const userExists = await User.exists({ email: req.body.email });
  if (userExists) {
    return res.json({
      message: `${req.body.email} already exists!`,
    });
  }
  //  Generate a safe gravatar URL for users
  const gravatarURL = getGravatarUrl(req.body.email);

  const obj = {
    email: req.body.email,
    displayName: req.body.displayName,
    firstName: req.body.firstName || "",
    lastName: req.body.lastName || "",
    // avatar: req.body.avatar || "", //disabled for security reasons
    avatar: gravatarURL,
  };
  const newUser = new User(obj);
  const newAuthContent = {
    _id: newUser._id,
    email: newUser.email,
    local: { email: newUser.email, password: req.body.password },
  };
  const newAuth = new Auth(newAuthContent);
  await newAuth.save();
  const user = await newUser.save();
  return res.json({
    path: req.originalUrl,
    data: {
      user: user,
    },
  });
};

const deleteUser = async function (req, res) {
  //  clear out user's profile information, posts, comments and likes
  const userId = req.user.id;
  // protect "guest" account from being deleted
  if (userId === "665630e767d39b96458fa94a") {
    return res.json({
      path: req.originalUrl,
      message: "You cannot delete the Guest account.",
    });
  }
  const existingUser = await User.findById(userId)
    .populate({
      path: "comments",
      transform: (doc) => doc._id,
    })
    .populate({
      path: "posts",
      transform: (doc) => doc._id,
    })
    .populate({
      path: "likes",
      transform: (doc) => doc._id,
    });

  //  Remove user from friends' friends lists
  const updatedFriends = await User.updateMany(
    { _id: { $in: existingUser.friends } },
    { $pull: { friends: userId } }
  );

  //  Create a list of IDs of existing friends requests
  const existingRequestsUserIds = existingUser.friendsRequests.map((el) =>
    el.requester.equals(userId) ? el.recipient : el.requester
  );

  //  Remove friends request entries from other users
  const updatedFriendRequests = await User.updateMany(
    {
      _id: {
        $in: existingRequestsUserIds,
      },
    },
    {
      $pull: {
        friendsRequests: {
          $in: existingUser.friendsRequests,
        },
      },
    }
  );

  //  Remove posts matching UserID
  const deletedUserPosts = await Post.deleteMany({
    _id: { $in: existingUser.posts },
  });

  // Remove user likes from all posts
  const updatedPostLikes = await Post.updateMany(
    {
      _id: {
        $in: existingUser.likes,
      },
    },
    {
      $pull: {
        likes: userId,
      },
    }
  );
  //  Remove comments by user
  const deletedUserComments = await Comment.deleteMany({
    _id: { $in: existingUser.comments },
  });

  //  Remove comments linked to deleted posts
  const deletedLinkedComments = await Comment.deleteMany({
    postId: { $in: existingUser.posts },
  });

  //  Remove user and authorization account document
  const deletedUser = await User.findByIdAndDelete(userId);
  const deletedAuth = await Auth.findByIdAndDelete(userId);

  return res.json({
    path: req.originalUrl,
    userId,
    updatedFriends,
    updatedFriendRequests,
    deletedUserPosts,
    updatedPostLikes,
    deletedUserComments,
    deletedLinkedComments,
    deletedUser: deletedUser && true,
    deletedAuth: deletedAuth && true,
  });
};

module.exports = {
  getLogin,
  deleteUser,
  checkAuth,
  isAuthenticated, 
  postUserLocal,
};
