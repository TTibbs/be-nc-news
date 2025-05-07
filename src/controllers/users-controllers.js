const {
  selectUsers,
  selectUserByUsername,
  createNewUser,
  patchUserByUsername,
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
  selectUserByUsername(addedUser.username)
    .then((existingUser) => {
      if (existingUser) {
        return Promise.reject({ status: 409, msg: "Username already exists" });
      }
      return createNewUser(addedUser);
    })
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchUserByUsername = (req, res, next) => {
  const { username } = req.params;
  if (!req.body.name && !req.body.avatar_url) {
    return res.status(400).send({ msg: "No valid fields to update" });
  }
  const updatedUser = req.body;
  const promises = [
    selectUserByUsername(username),
    updatedUser.username
      ? selectUserByUsername(updatedUser.username)
      : Promise.resolve(null),
    patchUserByUsername(username, updatedUser),
  ];
  Promise.all(promises)
    .then(([existingUser, newUsernameUser, updatedUser]) => {
      if (!existingUser) {
        return Promise.reject({ status: 404, msg: "User does not exist" });
      }
      if (updatedUser.username && newUsernameUser) {
        return Promise.reject({ status: 409, msg: "Username already exists" });
      }
      res.status(200).send({ updatedUser });
    })
    .catch((err) => next(err));
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
