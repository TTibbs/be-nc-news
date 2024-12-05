const db = require("../../db/connection.js");

exports.selectTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectTopicBySlug = (topic) => {
  if (!topic) return Promise.resolve();
  return db
    .query(`SELECT * FROM topics WHERE topics.slug = $1`, [topic])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic doesn't exist" });
      }
      return rows[0];
    });
};

exports.writeTopic = (topicBody) => {
  const { slug, description } = topicBody;
  return this.selectTopicBySlug(slug)
    .then(() => {
      return Promise.reject({
        status: 400,
        msg: "Topic already exists",
      });
    })
    .catch((err) => {
      if (err.status === 404) {
        return db.query(
          `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`,
          [slug, description]
        );
      }
      throw err;
    })
    .then(({ rows }) => rows[0]);
};

exports.selectTopicToDelete = (slug) => {
  return db
    .query(
      `
      WITH deleted_comments AS (
        DELETE FROM comments
        WHERE article_id IN (SELECT article_id FROM articles WHERE topic = $1)
      ),
      deleted_articles AS (
        DELETE FROM articles
        WHERE topic = $1
      )
      DELETE FROM topics
      WHERE slug = $1
      RETURNING *;
      `,
      [slug]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Topic doesn't exist" });
      }
      return rows[0];
    });
};
