const express = require("express");
const {
  getTopics,
  getArticleById,
} = require("./controllers/nc-news.controllers");
const app = express();
const endpoints = require("../endpoints.json");

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid input" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
