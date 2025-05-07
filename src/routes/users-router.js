const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  postUser,
  selectUserToDelete,
} = require("../controllers/users-controllers.js");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);
usersRouter.post("/", postUser);
usersRouter.delete("/:username", selectUserToDelete);

module.exports = usersRouter;
