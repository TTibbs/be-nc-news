const {
  selectTopics,
  writeTopic,
  selectTopicBySlug,
  patchTopicBySlug,
  selectTopicToDelete,
} = require("../models/topics-models.js");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getTopicBySlug = (req, res, next) => {
  const { slug } = req.params;
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

exports.patchTopicBySlug = (req, res, next) => {
  const { slug } = req.params;
  const topicBody = req.body;
  if (!topicBody.description) {
    return res.status(400).send({ msg: "No description provided" });
  }
  if (req.body.length === 0) {
    return res.status(400).send({ msg: "No valid fields provided" });
  }
  patchTopicBySlug(slug, topicBody)
    .then((updatedTopic) => {
      res.status(200).send({ updatedTopic });
    })
    .catch(next);
};

exports.deleteTopicBySlug = (req, res, next) => {
  const { slug } = req.params;
  selectTopicToDelete(slug)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
