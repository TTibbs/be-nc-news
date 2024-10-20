const topicsRouter = require("express").Router();
const {
  getTopics,
  postTopic,
} = require("../controllers/topics-controllers.js");

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
