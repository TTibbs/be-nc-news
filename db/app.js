const express = require("express");
const {
  getTopics,
  getArticleById,
  getArticles,
  getArticleCommentsById,
} = require("./controllers/nc-news.controllers.js");
const app = express();
const endpoints = require("../endpoints.json");
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
  inputErrorHandler,
} = require("./errors/index.js");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.all("/api/*", inputErrorHandler);

app.use(psqlErrorHandler);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;
