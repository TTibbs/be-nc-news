const commentsRouter = require("express").Router();
const {
  getComments,
  deleteCommentById,
  patchCommentById,
} = require("../controllers/comments-controllers.js");

commentsRouter.get("/", getComments);
commentsRouter.patch("/:comment_id", patchCommentById);
commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;
