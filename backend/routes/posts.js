const express = require("express");
const PostsController = require("../controllers/posts");

const chechAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/file");

const router = express.Router();

router.post(
  "",
  chechAuth,
  extractFile,
  PostsController.createPost
);

router.put(
  "/:id",
  chechAuth,
  extractFile,
  PostsController.updatePost
);

router.get("/:id", PostsController.getPost);

router.get("", PostsController.getPosts);

router.delete("/:id", chechAuth, PostsController.deletePost);

module.exports = router;
