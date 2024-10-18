const {
  fetchTopics,
  fetchArticleById,
  fetchArticles,
  fetchArticleCommentsById,
  writeArticleCommentById,
  fetchUserByUsername,
  selectArticleIdToPatch,
  selectCommentToDelete,
  selectCommentById,
  selectUsers,
  selectTopicBySlug,
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
  const { sort_by, order, topic } = req.query;
  selectTopicBySlug(topic)
    .then(() => {
      return fetchArticles(sort_by, order, topic);
    })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
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

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [
    fetchArticleById(article_id),
    selectArticleIdToPatch(inc_votes, article_id),
  ];
  Promise.all(promises)
    .then((result) => {
      const updatedArticle = result[1];
      res.status(202).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [
    selectCommentById(comment_id),
    selectCommentToDelete(comment_id),
  ];
  Promise.all(promises)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
