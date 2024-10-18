const usersRouter = require("express").Router();
const { getUsers, getUserById } = require("../controllers/nc-news.controllers.js");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserById);

module.exports = usersRouter;
