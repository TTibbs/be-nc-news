const express = require("express");
const { getTopics } = require("./controllers/nc-news.controllers");
const app = express();
const endpoints = require("../endpoints.json");

app.get("/api/topics", getTopics);

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

app.all("/api/*", (req, res, next) => {
  res.status(404).send({ msg: "Invalid input" });
});

module.exports = app;
