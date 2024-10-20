const {
  selectArticles,
  selectArticleById,
  selectArticleCommentsById,
  writeArticle,
  writeArticleCommentById,
  selectArticleIdToPatch,
  selectArticleToDelete,
} = require("../models/articles-models.js");
const { selectUserByUsername } = require("../models/users-models.js");
const { selectTopicBySlug } = require("../models/topics-models.js");

exports.getArticles = (req, res, next) => {
  const { sort_by, order, topic, limit = 10, p = 1 } = req.query;
  selectTopicBySlug(topic)
    .then(() => {
      return selectArticles(sort_by, order, topic, limit, p);
    })
    .then(({ articles, total_count }) => {
      res.status(200).send({ articles, total_count });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [
    selectArticleCommentsById(article_id),
    selectArticleById(article_id),
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

exports.postArticle = (req, res, next) => {
  const articleBody = req.body;
  articleBody.created_now = new Date().toISOString();
  articleBody.votes = 0;
  writeArticle(articleBody)
    .then((results) => {
      const newArticle = results;
      res.status(201).send({ newArticle });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticleCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  const promises = [
    selectArticleById(article_id),
    writeArticleCommentById(article_id, username, body),
    selectUserByUsername(username),
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
    selectArticleById(article_id),
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

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleToDelete(article_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
