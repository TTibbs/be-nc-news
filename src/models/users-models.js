const db = require("../../db/connection.js");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.selectUserById = (user_id) => {
  return db
    .query(`SELECT * FROM users WHERE user_id = $1`, [user_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      return rows[0];
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

exports.patchUserProfile = (updates, user_id) => {
  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const values = Object.values(updates);
  const queryParams = [...values, user_id];

  const query = `UPDATE users SET ${setClause} WHERE user_id = $${
    values.length + 1
  } RETURNING *;`;

  return db.query(query, queryParams).then(({ rows }) => {
    return rows[0];
  });
};
