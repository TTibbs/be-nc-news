const express = require("express");
const { getTopics } = require("./controllers/nc-news.controllers");
const app = express();

app.get("/api/topics", getTopics);

app.all("/api/*", (req, res, next) => {
    res.status(404).send({ msg: "Invalid input" })
})

module.exports = app;