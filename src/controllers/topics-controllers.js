const {
  selectTopics,
  writeTopic,
  selectTopicBySlug,
} = require("../models/topics-models.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getTopicBySlug = (req, res, next) => {
  selectTopicBySlug(slug)
    .then((topic) => {
      res.status(200).send({ topic });
    })
    .catch(next);
};

exports.postTopic = (req, res, next) => {
  const topicBody = req.body;
  if (!topicBody.slug || !topicBody.description) {
    return res.status(400).send({ msg: "Bad request" });
  }
  writeTopic(topicBody)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch(next);
};
