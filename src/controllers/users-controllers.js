const {
  selectUsers,
  selectUserByUsername,
  createNewUser,
  deleteUser,
} = require("../models/users-models.js");

exports.getUsers = (req, res, next) => {
  selectUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  selectUserByUsername(username)
    .then((user) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postUser = (req, res, next) => {
  const addedUser = req.body;
  createNewUser(addedUser)
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch((err) => {
      if (err.code === "23505") {
        res.status(409).send({ msg: "Username already exists" });
      } else {
        next(err);
      }
    });
};

exports.selectUserToDelete = (req, res, next) => {
  const { username } = req.params;
  deleteUser(username)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
