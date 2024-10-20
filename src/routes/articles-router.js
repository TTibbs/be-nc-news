const articlesRouter = require("express").Router();
const {
  getArticles,
  postArticle,
  getArticleById,
  getArticleCommentsById,
  postArticleCommentById,
  patchArticleById,
  deleteArticleById,
} = require("../controllers/articles-controllers.js");

articlesRouter.get("/", getArticles);
articlesRouter.post("/", postArticle);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticleCommentsById);
articlesRouter.post("/:article_id/comments", postArticleCommentById);
articlesRouter.patch("/:article_id", patchArticleById);
articlesRouter.delete("/:article_id", deleteArticleById);

module.exports = articlesRouter;
