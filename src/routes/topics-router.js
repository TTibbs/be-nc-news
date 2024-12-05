const topicsRouter = require("express").Router();
const {
  getTopics,
  postTopic,
  getTopicBySlug,
  deleteTopicBySlug,
} = require("../controllers/topics-controllers.js");

topicsRouter.get("/", getTopics);
topicsRouter.post("/", postTopic);
topicsRouter.get("/:slug", getTopicBySlug);
topicsRouter.delete("/:slug", deleteTopicBySlug);

module.exports = topicsRouter;
