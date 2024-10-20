const { selectTopics, writeTopic } = require("../models/topics-models.js");

exports.getTopics = (req, res, next) => {
  selectTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.postTopic = (req, res, next) => {
  const topicBody = req.body;
  writeTopic(topicBody)
    .then((result) => {
      const newTopic = result;
      res.status(201).send({ newTopic });
    })
    .catch((err) => {
      next(err);
    });
};
