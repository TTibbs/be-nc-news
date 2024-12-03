const {
  selectUsers,
  selectUserById,
  createNewUser,
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

exports.getUserById = (req, res, next) => {
  const { username } = req.params;
  selectUserById(username)
    .then((user) => {
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
      next(err);
    });
};
