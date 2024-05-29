const authController = require("./../controllers/authController.js");
const User = require("../models/user.js");
const Post = require("../models/post.js")
const Comment = require("../models/comment.js")

const express = require("express");
const { default: mongoose } = require("mongoose");
// import apiController from './../controllers/apiController';
const router = express.Router();

//Middleware
const validateParamId = function (req, res, next) {
  if (mongoose.isValidObjectId(req.params.id)) {
    return next();
  } else {
    return res.json({
      message: `Invalid _id parameter path: ${req.originalUrl}`,
      id: req.params.id,
    });
  }
};
///////////////////////////////////////

router.get("/", authController.loggedIn, function (req, res) {
  // User privacy wall (login modal) or Timeline/feed

  res.json({ message: `get'/' path: ${req.baseUrl + req.path}` });
});

router.get("/comment/:id", authController.loggedIn, async function (req, res) {
  // Get detailed comment info
  try {
    const comment = await Comment.findById(req.params.id).lean();
    if(!comment){
      return res.json({
        message: `get'/comment/:id' path: ${req.originalUrl}`,
        error: "Comment does not exist",
      });
    }
    if (!comment.author.equals(req.user._id)) {
      return res.json({
        message: `get'/comment/:id' path: ${req.originalUrl}`,
        error: "Not authorized",
      });
    }
    res.json({
      message: `get'/comment/:id' path: ${req.originalUrl}`,
      comment: comment,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete(
  "/user/comment/:id",
  authController.loggedIn,
  async function (req, res) {
    // User (author) deletes one existing comment
    try {
      const comment = await Comment.findById(req.params.id);
      if (!comment) {
        return res.status(404).json({
          message: `delete'/user/comment/:id' path: ${req.originalUrl}`,
          error: "Comment does not exist",
        });
      }
      if (!comment.author.equals(req.user._id)) {
        return res.status(401).json({
          message: `delete'/user/comment/:id' path: ${req.originalUrl}`,
          error: "Not authorized",
        });
      }
      const deleteCount = await Comment.deleteOne({_id: req.params.id});

      res.json({
        message: `delete'/user/comment/:id' path: ${req.originalUrl}`,
        comment: comment,
        deleteCount: deleteCount,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post("/user/post/:id", authController.loggedIn, async function (req, res) {
  // User or user's friend creates new comment 
  try {
    const post = await Post.findById(req.params.id);
    if(!post) {
      return res
        .status(404)
        .json({
          message: `post'/user/post/:id' path: ${req.originalUrl}`,
          error: "Post does not exist",
        });
    }  
    const isAuthor = post.author.equals(req.user._id);
    let isFriend, userFriends;
    if(!isAuthor){
      userFriends = await User.findById(req.user._id, "friends");
      isFriend = userFriends.friends.indexOf(post.author);
      if (isFriend === -1) {
        return res.status(401).json({
          message: `post'user/post/:id' path: ${req.originalUrl}`,
          error: "User is not friend of author or author",
        });
      }
    }
    const newCommentData = {
        postId: req.params.id,
        author: req.user._id,
        content: req.body.content,
      };
      const newComment = new Comment(newCommentData);
      const comment = await newComment.save();

      res.json({
        message: `post'/post/:id' path: ${req.originalUrl}`,
        comment: comment,
        userFriends: userFriends,
        isFriend: isFriend
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


router.get(
  "/user/posts/index",
  authController.loggedIn,
  async function (req, res) {
    // Get list of user timeline page (user and friends summary posts)
    try {
      const user = await User.findById(req.user._id, "friends").lean();
      const postCount = await Post.countDocuments({
        author: { $in: [user._id, ...user.friends] },
      });
      const maxPage = Math.floor(postCount / 25);
      const page = Math.max(
        0,
        Math.min(maxPage, parseInt(req.query.page) || 0)
      );
      const posts = await Post.find({
        author: { $in: [user._id, ...user.friends] },
      })
        .sort({ created: -1 })
        .limit(25)
        .populate({
          path: "author",
          select: "avatar displayName",
        })
        .populate({
          path: "commentCount",
        })
        .exec();

      console.log(posts);
      res.json({
        path: `${req.originalUrl}`,
        data: { posts, page, maxPage },
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get(
  "/user/:id/posts",
  authController.loggedIn,
  validateParamId,
  async function (req, res) {
    // Get list of user posts (user summary posts)
    try {
      const friend = await User.findOne(
        {
          _id: req.params.id,
          friends: { $in: [req.user._id] },
        },
        "avatar displayName"
      ).populate({
        path: "postCount",
      });
      
      console.log(
        "friend",
        friend,
      );
      if (!friend) {
        return res.status(401).json({
          message: `post'user/post/:id' path: ${req.originalUrl}`,
          error: "User is not friend of author",
        });
      }
      const postCount = friend.postCount
      const maxPage = Math.floor(postCount / 25);
      const page = Math.max(
        0,
        Math.min(maxPage, parseInt(req.query.page) || 0)
      );

      console.log("postCount", postCount, "maxpage", maxPage);

      const friendPosts = await Post.find({
        author: { $in: [friend._id] },
      })
        .sort({ created: -1 })
        .limit(25)
        .populate({
          path: "author",
          select: "avatar displayName",
        })
        .exec();

      console.log(friendPosts);
      res.json({
        message: `get'user/id:/posts' path: ${req.originalUrl}`,
        friendPosts: friendPosts,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.post("/user/post", authController.loggedIn, async function (req, res) {
  // User creates new post
  try {
    const newPostData = { author: req.user.id, content: req.body.content };
    const newPost = new Post(newPostData);
    const post = await newPost.save();
    return res.json({
      path: `${req.originalUrl}`,
      data: post,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.put("/user/post/:id/like", authController.loggedIn, async function(req, res){
  //User likes/unlikes a post
  try {
    const post = await Post.findById(req.params.id, 'likes');
    console.log('post',post)
    if (!post) {
      return res.status(404).json({
        message: `put'user/post/:id/like' path: ${req.originalUrl}`,
        error: "Post does not exist",
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
      message: `put'/post/:id/likes' path: ${req.originalUrl}`,
      postLikes: postLikes,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

router.get(
  "/user/post/:id",
  authController.loggedIn,
  async function (req, res) {
    // Get detailed post info
    try {
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
          message: `get'/user/post/:id' path: ${req.originalUrl}`,
          error: "Post does not exist",
        });
      }
      res.json({
        path: `${req.originalUrl}`,
        data: { post }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.delete("/user/post/:id", authController.loggedIn, async function (req, res) {
  // Delete post and associated comments
  try {
    const post = await Post.findById(req.params.id).populate({
      path: 'comments',
      select: '_id'
    })
    
    if (!post) {
      return res.status(404).json({
        message: `delete'/user/post/:id' path: ${req.originalUrl}`,
        error: "Post does not exist",
      });
    }
    if (!post.author.equals(req.user._id)) {
      return res.status(401).json({
        message: `delete'/user/post/:id' path: ${req.originalUrl}`,
        error: "Not authorized",
      });
    }
    const deletePostCount = await Post.deleteOne({ _id: req.params.id });
    const deleteCommentCount = await Comment.deleteMany({ postId: req.params.id});

    res.json({
      message: `delete'/user/post/:id' path: ${req.originalUrl}`,
      post: post,
      deletePostCount: deletePostCount,
      deleteCommentCount: deleteCommentCount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/post/:id/comments", async function (req, res) {
  // Get post comment chain
  try {
    const exists = await Post.exists({ _id: req.params.id });
    if (!exists) {
      return res.status(404).json({
        message: `get'/post/:id/comments' path: ${req.originalUrl}`,
        error: "Post does not exist",
      });
    }
    const comments = await Comment.find(
      { postId: req.params.id },
      "content created author"
    ).populate({ path: "author", select: "displayName avatar" });
    res.json({
      message: `get'/post/:id/comments' path: ${req.originalUrl}`,
      comments: comments,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


router.get(
  "/user/index", 
  authController.loggedIn, 
  async function (req, res) {
  // Index of all Odinbook users
  try {
    //grab user outstanding friend requests and friends
    // const user = await User.findById(req.user.id, "friends, friendsRequests");
    //set valid pagination limits if required
    const userCount = await User.count();
    const limit = Math.max(1, Math.min(25, parseInt(req.query.limit) || 10));
    const maxPage = Math.floor(userCount / limit);
    const page = Math.max(0, Math.min(maxPage, parseInt(req.query.page) || 0));
    
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const users = await User.aggregate([
      {
        $match: { _id: { $nin: [userId] } },
      },
      {
        $project: {
          displayName: 1,
          avatar: 1,
          isFriend: {$in:[req.user._id,"$friends"]},
          isRequester: {$in:[userId,"$friendsRequests.requester"]},
          isRecipient: {$in:[userId,"$friendsRequests.recipient"]},
        },
      },
      {
        $addFields: {
          // friend: false,
          // friend2: { $in: [req.user._id, []] },
          // friends3: {$expr:{$in:[req.user._id,"$friends"]}},
          // friend2: { $in: [req.user._id, [req.user._id]] },
          // friendRequest: false,
        },
      },
      {
        $sort: {
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
    console.log(users)
    res.json({
      path: `${req.originalUrl}`,
      data: {
        users,
        limit,
        page,
        userCount,
        maxPage,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/user/:id/profile", validateParamId, async function (req, res) {
  // Get user profile (profile info, photo and posts)
  try {
    const userData = await User.findById(
      req.params.id,
      "avatar firstName lastName displayName posts updated created"
    )
      .populate({
        path: "posts",
      })
      .exec();

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
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/user/:id/friends", validateParamId, async function (req, res) {
  try {
    // List all friends
    const friends = await User.findById(req.params.id, "friends")
      .lean()
      .populate("friends", "displayName firstName lastName avatar")
      .exec();
    res.json({
      message: `get'/user/:id/friends' path: ${req.originalUrl}`,
      friends: friends,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post(
  "/user/friendsrequest",
  authController.loggedIn,
  async function (req, res) {
    try {
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
      //  validate valid userIDs
      const requester = await User.findById(
        requesterId,
        "friends friendsRequests"
      );
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
          (el.recipient.equals(recipientId) &&
            el.requester.equals(requesterId)) ||
          (el.recipient.equals(requesterId) && el.requester.equals(recipientId))
      );
      console.log('existingrequest',existingRequest)
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
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.delete(
  "/user/friendsrequest",
  authController.loggedIn,
  async function (req, res) {
    try {
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
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.put(
  "/user/friendsrequest",
  authController.loggedIn,
  async function (req, res) {
    try {
      // Accept/reject request
      const userId = req.user.id;
      const friendId = req.body.friendId;
      const requestStatus = req.body.requestStatus;
      console.log(
        "/user/friendsrequest route: ",
        userId,
        friendId,
        requestStatus
      );
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
      const existingRequest = await user.friendsRequests.find(
        (el) => {
          return el.recipient.equals(userId) && el.requester.equals(friendId)
        }
      );

      if (existingRequest) {
        // Update two documents (use transactions for future refactor)
        const options = {
          new: true,
          projection: "friends friendsRequests",
          lean: true,
        };
        console.log('updating request and friends list if required:', requestStatus, requestStatus===true)
        if (requestStatus === true) {
          console.log("adding new friend");
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
          console.log("rejecting request....");
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
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.get(
  "/user/friendsrequest",
  authController.loggedIn,
  async function (req, res) {
    try {
      //  validate valid userIDs
      const user = await User.findById(req.user.id, "friendsRequests");
      return res.json({
        message: `get'/user/friendsrequest' path: ${req.originalUrl}`,
        user: user,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

router.delete("/user/friends", 
authController.loggedIn,
  async function (req, res) {
    try {
      // Remove friend from friendslist
      const userId = req.user.id;
      const friendId = req.body.friendId;
      // validate IDs
      if (
        !mongoose.isValidObjectId(userId) ||
        !mongoose.isValidObjectId(friendId)
      ) {
        return res.json({ message: "Invalid reference" });
      }

      //  validate valid userIDs
      const user = await User.findById(userId, "friends").lean();
      if (!user) {
        return res.json({
          message: "user does not exist",
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
        message: `delete'/user/friends' path: ${req.originalUrl}`,
        userFriends: userFriends,
        friendFriends: friendFriends,
      });
    } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/user/friends", authController.loggedIn, async function (req, res) {
  try {
    // Get friendslist
    const user = await User.findById(req.user.id, "friends").lean();
    res.json({
      message: `get'/user/friends' path: ${req.originalUrl}`,
      user: user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});


router.get("/user/data", authController.loggedIn, async function (req, res) {
  const user = await User.findById(req.user.id, 'firstName lastName displayName email avatar').lean()
  res.json({ user: user });
});

module.exports = router;
