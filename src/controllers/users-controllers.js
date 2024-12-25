const {
  selectUsers,
  selectUserById,
  createNewUser,
  patchUserProfile,
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
  const { user_id } = req.params;
  selectUserById(user_id)
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
      if (err.code === "23505") {
        res.status(409).send({ msg: "Username already exists" });
      } else {
        next(err);
      }
    });
};

exports.patchUserById = (req, res, next) => {
  const { user_id } = req.params;
  const updates = req.body;

  if (Object.keys(updates).length === 0) {
    return res.status(400).send({ message: "No data to update" });
  }

  const promises = [
    selectUserById(user_id),
    patchUserProfile(updates, user_id),
  ];
  Promise.all(promises)
    .then((result) => {
      const patchedUser = result[1];
      res.status(202).send({ patchedUser });
    })
    .catch((err) => {
      next(err);
    });
};
