const commentsRouter = require("express").Router();
const { deleteCommentById } = require("../controllers/nc-news.controllers.js");

commentsRouter.delete("/:comment_id", deleteCommentById);

module.exports = commentsRouter;