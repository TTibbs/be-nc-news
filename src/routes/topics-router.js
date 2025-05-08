const topicsRouter = require("express").Router();
const {
  getTopics,
  getTopicBySlug,
  postTopic,
  patchTopicBySlug,
  deleteTopicBySlug,
} = require("../controllers/topics-controllers.js");

topicsRouter.get("/", getTopics);
topicsRouter.get("/:slug", getTopicBySlug);
topicsRouter.post("/", postTopic);
topicsRouter.patch("/:slug", patchTopicBySlug);
topicsRouter.delete("/:slug", deleteTopicBySlug);

module.exports = topicsRouter;
