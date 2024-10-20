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
      return rows;
    });
};

exports.writeTopic = (topicBody) => {
  const { slug, description } = topicBody;
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *;`,
      [slug, description]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
