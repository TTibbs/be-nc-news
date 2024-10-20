const commentsRouter = require("express").Router();
const {
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments-controllers.js");

commentsRouter.patch("/:comment_id", patchCommentById);
commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
