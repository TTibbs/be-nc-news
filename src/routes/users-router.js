const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  postUser,
  selectUserToDelete,
  patchUserByUsername,
} = require("../controllers/users-controllers.js");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);
usersRouter.post("/", postUser);
usersRouter.patch("/:username", patchUserByUsername);
usersRouter.delete("/:username", selectUserToDelete);

module.exports = usersRouter;
