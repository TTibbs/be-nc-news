const db = require("../../db/connection.js");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUserByUsername = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.createNewUser = (addedUser) => {
  const { username, name, avatar_url } = addedUser;
  return db
    .query(
      `INSERT INTO users (username, name, avatar_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (username) DO NOTHING
       RETURNING *;`,
      [username, name, avatar_url]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        const error = new Error("Username already exists");
        error.code = "23505";
        throw error;
      }
      return rows[0];
    });
};

exports.deleteUser = (username) => {
  return db
    .query(`DELETE FROM users WHERE username = $1 RETURNING *`, [username])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      return rows[0];
    });
};
