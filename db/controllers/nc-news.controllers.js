const { fetchTopics, fetchArticleById } = require("../models/nc-news.models");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article_id) => {
      res.status(200).send({ article_id });
    })
    .catch((err) => {
      next(err);
    });
};
