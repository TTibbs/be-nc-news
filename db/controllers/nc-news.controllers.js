const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  writeArticleCommentById,
  fetchUserByUsername,
} = require("../models/nc-news.models");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    fetchArticleCommentsById(article_id),
    fetchArticleById(article_id),
  ];
  Promise.all(promises)
    .then((results) => {
      const articleComments = results[0];
      res.status(200).send({ articleComments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const promises = [
    fetchArticleById(article_id),
    writeArticleCommentById(article_id, username, body),
    fetchUserByUsername(username),
  ];
  Promise.all(promises)
    .then((result) => {
      const newComment = result[1];
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};
