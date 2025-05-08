const usersRouter = require("express").Router();
const {
  getUsers,
  getUserByUsername,
  postUser,
  selectUserToDelete,
  patchUserByUsername,
  getUserCommentVotes,
  getUserArticleVotes,
} = require("../controllers/users-controllers.js");

usersRouter.get("/", getUsers);
usersRouter.get("/:username", getUserByUsername);
usersRouter.get("/:username/commentvotes", getUserCommentVotes);
usersRouter.get("/:username/articlevotes", getUserArticleVotes);
usersRouter.post("/", postUser);
usersRouter.patch("/:username", patchUserByUsername);
usersRouter.delete("/:username", selectUserToDelete);

module.exports = usersRouter;
