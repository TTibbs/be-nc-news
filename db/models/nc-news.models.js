const db = require("../connection");
const { dataBaseError } = require("../errors");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article) => {
  return db
    .query(
      `SELECT * FROM articles
      WHERE article_id = $1;`,
      [article]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article does not exist" });
      }
      return rows[0];
    });
};

exports.fetchArticles = () => {
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)
      AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
      `
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Invalid input" });
      }
      return rows;
    });
};

exports.fetchArticleCommentsById = (article_id) => {
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

exports.fetchUserByUsername = (username) => {
  if (!username) {
    return dataBaseError;
  }
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      return rows[0];
    });
};
