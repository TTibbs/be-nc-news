const topicsRouter = require("express").Router();
const {
  getTopics,
  postTopic,
  getTopicBySlug,
} = require("../controllers/topics-controllers.js");

topicsRouter.get("/", getTopics);
topicsRouter.get("/:slug", getTopicBySlug);
topicsRouter.post("/", postTopic);

module.exports = topicsRouter;
