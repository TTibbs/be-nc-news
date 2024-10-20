const {
  selectCommentToDelete,
  selectCommentById,
  selectCommentToPatchById,
} = require("../models/comments-models.js");

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  const promises = [
    selectCommentById(comment_id),
    selectCommentToPatchById(inc_votes, comment_id),
  ];
  Promise.all(promises)
    .then((result) => {
      const updatedComment = result[1];
      res.status(202).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const promises = [
    selectCommentById(comment_id),
    selectCommentToDelete(comment_id),
  ];
  Promise.all(promises)
    .then((result) => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
