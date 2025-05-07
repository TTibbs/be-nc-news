const apiRouter = require("express").Router();
const topicsRouter = require("./topics-router");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const endpoints = require("../endpoints.json");

apiRouter.get("/", (req, res) => {
  res.status(200).send({ endpoints: endpoints });
});

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
