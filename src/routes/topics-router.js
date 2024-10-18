const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/nc-news.controllers.js");

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
