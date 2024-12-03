const usersRouter = require("express").Router();
const {
  getUsers,
  getUserById,
  postUser,
} = require("../controllers/users-controllers.js");

usersRouter.get("/", getUsers);
usersRouter.post("/", postUser);
usersRouter.get("/:username", getUserById);

module.exports = usersRouter;
