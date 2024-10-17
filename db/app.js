const express = require("express");
const {
  getTopics,
  getArticleById,
  getArticles,
  getArticleCommentsById,
  postArticleCommentById,
  patchArticleById,
  deleteCommentById,
} = require("./controllers/nc-news.controllers.js");
const app = express();
const endpoints = require("../endpoints.json");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
  inputErrorHandler,
} = require("./errors/index.js");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.post("/api/articles/:article_id/comments", postArticleCommentById);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteCommentById)

app.all("/api/*", inputErrorHandler);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
