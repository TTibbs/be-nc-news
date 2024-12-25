const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  postUser,
  patchUserById,
} = require("../controllers/users-controllers.js");

usersRouter.get("/", getUsers);
usersRouter.post("/", postUser);
usersRouter.get("/:user_id", getUserById);
usersRouter.patch("/:user_id", patchUserById);

module.exports = usersRouter;
