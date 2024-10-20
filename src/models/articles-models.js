const db = require("../../db/connection.js");

exports.selectArticles = (
  sort_by = "created_at",
  order = "DESC",
  topic = "",
  limit = 10,
  page = 1
) => {
  sort_by = sort_by.toLowerCase();
  order = order.toUpperCase();
  const validSortQueries = [
    "created_at",
    "article_id",
    "title",
    "topic",
    "author",
    "body",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  const validOrderQueries = ["ASC", "DESC"];

  if (!validSortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  if (!validOrderQueries.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id`;
  const queryValues = [];

  if (topic) {
    topic = topic.toLowerCase();
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryString += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

  const offset = (page - 1) * limit;
  queryString += ` LIMIT $${queryValues.length + 1} OFFSET $${
    queryValues.length + 2
  }`;
  queryValues.push(limit, offset);

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article) => {
  return db
    .query(
      `SELECT articles.author, articles.body, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;`,
      [article]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
};

exports.selectArticleCommentsById = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments
      WHERE comments.article_id = $1
      ORDER BY created_at DESC;`,
      [article_id]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.writeArticle = (articleBody) => {
  const { title, topic, author, body, article_img_url } = articleBody;
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [title, topic, author, body, article_img_url]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.writeArticleCommentById = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticleIdToPatch = (inc_votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE articles.article_id = $2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticleToDelete = (article_id) => {
  return db
    .query(
      `
    WITH deleted_comments AS (
      DELETE FROM comments
      WHERE article_id = $1
    )
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING *;
    `,
      [article_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article doesn't exist" });
      }
      return rows[0];
    });
};
