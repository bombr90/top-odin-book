const authController = require("./../controllers/authController.js");
const asyncHandler = require("express-async-handler");
const {
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
} = require("./../controllers/apiController.js");
const express = require("express");
const { validateParamId } = require("./../controllers/apiController");
const router = express.Router();

router.get("/", authController.isAuthenticated)

router.get("/user/data", authController.checkAuth, asyncHandler(getUserData));

router.delete(
  "/user/comment/:id",
  validateParamId,
  authController.checkAuth,
  asyncHandler(deleteComment)
);

router.post(
  "/user/post/:id",
  validateParamId,
  authController.checkAuth,
  asyncHandler(postComment)
);

router.get(
  "/user/posts/index",
  authController.checkAuth,
  asyncHandler(getPostIndex)
);

router.post("/user/post", authController.checkAuth, asyncHandler(postPost));

router.put(
  "/user/post/:id/like",
  validateParamId,
  authController.checkAuth,
  asyncHandler(putPostLike)
);

router.get(
  "/user/post/:id",
  validateParamId,
  authController.checkAuth,
  asyncHandler(getPostDetails)
);

router.delete(
  "/user/post/:id",
  validateParamId,
  authController.checkAuth,
  asyncHandler(deletePost)
);

router.get("/user/index", authController.checkAuth, asyncHandler(getUserIndex));

router.get(
  "/user/:id/profile",
  authController.checkAuth,
  validateParamId,
  asyncHandler(getUserProfile)
);

router.post(
  "/user/friendsrequest",
  authController.checkAuth,
  asyncHandler(postFriendsRequest)
);

router.delete(
  "/user/friendsrequest",
  authController.checkAuth,
  asyncHandler(deleteFriendsRequest)
);

router.put(
  "/user/friendsrequest",
  authController.checkAuth,
  asyncHandler(putFriendsRequest)
);

router.delete(
  "/user/friends",
  authController.checkAuth,
  asyncHandler(deleteFriend)
);

module.exports = router;

/////////////////////////////////////////////////////////////////////
//Disabled API routes not integrated with front end, but work when tested using Postman. Protection (eg. requiring authentication be owner, or owner/friend) has not necessarily been implemented
/////////////////////////////////////////////////////////////////////
// router.get(
//   "/user/comment/:id",
//   authController.checkAuth,
//   async function (req, res) {
//   // Get detailed comment info (private)
//   try {
//     const comment = await Comment.findById(req.params.id).lean();
//     if (!comment) {
//       return res.json({
//         path: req.originalUrl,
//         error: "Comment does not exist",
//       });
//     }
//     if (!comment.author.equals(req.user._id)) {
//       return res.json({
//         path: req.originalUrl,
//         error: "Not authorized",
//       });
//     }
//     res.json({
//       path: req.originalUrl,
//       comment,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// router.get(
//   "/user/:id/posts",
//   authController.checkAuth,
//   validateParamId,
//   async function (req, res) {
//     // Get list of friends posts (limited)
//     try {
//       const friend = await User.findOne(
//         {
//           _id: req.params.id,
//           friends: { $in: [req.user._id] },
//         },
//         "avatar displayName"
//       ).populate({
//         path: "postCount",
//       });

//       if (!friend) {
//         return res.status(401).json({
//           path: req.originalUrl,
//           error: "User is not friend of author",
//         });
//       }

//       const postCount = friend.postCount;
//       const limit = Math.max(1, Math.min(25, parseInt(req.query.limit) || 10));
//       const maxPage = Math.ceil(postCount / limit);
//       const page = Math.max(
//         0,
//         Math.min(maxPage, parseInt(req.query.page) || 0)
//       );

//       const friendPosts = await Post.find({
//         author: { $in: [friend._id] },
//       })
//         .sort({ created: -1 })
//         .skip(limit*page)
//         .limit(limit)
//         .populate({
//           path: "author",
//           select: "avatar displayName",
//         })
//         .exec();

//       res.json({
//         path: req.originalUrl,
//         data: {
//           friendPosts,
//           maxPage,
//           page,
//           limit,
//           postCount
//         }
//       });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );

// router.get("/user/post/:id/comments", authController.checkAuth, async function (req, res) {
//   // Get post comment chain
//   try {
//     const exists = await Post.exists({ _id: req.params.id });
//     if (!exists) {
//       return res.status(404).json({
//         path: req.originalUrl,
//         error: "Post does not exist",
//       });
//     }
//     const comments = await Comment.find(
//       { postId: req.params.id },
//       "content created author"
//     ).populate({ path: "author", select: "displayName avatar" });
//     res.json({
//       path: req.originalUrl,
//       comments: comments,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// router.get(
//   "/user/friends",
//   authController.checkAuth,
//   async function (req, res) {
//     try {
//       // Get friendslist
//       const user = await User.findById(req.user.id, "friends").lean();
//       res.json({
//         message: `get'/user/friends' path: ${req.originalUrl}`,
//         user: user,
//       });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );
// router.get("/user/:id/friends", validateParamId, async function (req, res) {
//   try {
//     // List all friends
//     const friends = await User.findById(req.params.id, "friends")
//       .lean()
//       .populate("friends", "displayName firstName lastName avatar")
//       .exec();
//     res.json({
//       message: `get'/user/:id/friends' path: ${req.originalUrl}`,
//       friends: friends,
//     });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });
// router.get(
//   "/user/:id/friendsrequest",
//   authController.checkAuth,
//   async function (req, res) {
//     try {
//       // Get user's friendsrequests (public)
//       const userId = req.body.id;
//        if (
//          !mongoose.isValidObjectId(userId)
//        ) {
//          return res.status(400).json({ message: "Invalid reference" });
//        }

//       //  validate valid userIDs
//       const user = await User.findById(userId, "friendsRequests");
//       if(!user){
//         return res.status(404).json({
//           path: req.originalUrl,
//           message: "User does not exist"
//         })
//       }
//       return res.json({
//         path: req.originalUrl,
//         user,
//       });
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server Error");
//     }
//   }
// );
