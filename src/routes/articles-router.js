const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  getArticleCommentsById,
  postArticleCommentById,
  patchArticleById,
} = require("../controllers/nc-news.controllers.js");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleCommentsById);
articlesRouter.post("/:article_id/comments", postArticleCommentById);
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
