const { fetchTopics } = require("../models/nc-news.models");
const { req, res } = require("express");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};
