const app = require("../db/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");
const { toBeSorted } = require("jest-sorted");
let test_article_id = 1;
let test_comment_id = 1;

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
  test("Should return an array of objects containing topics slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET: /api", () => {
  test("Should return with valid endpoints that are available for users", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const testEndPoints = body.endpoints;
        expect(testEndPoints).toEqual(endpoints);
        expect(typeof body.endpoints).toBe("object");
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  describe("GET: 200", () => {
    test("Should return the details for article 1 as that is the endpoint being navigated to", () => {
      test_article_id = 1;
      return request(app)
        .get(`/api/articles/${test_article_id}`)
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(1);
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });
    test("Should return the details for article 2 as that is the endpoint being navigated to", () => {
      test_article_id = 2;
      return request(app)
        .get(`/api/articles/${test_article_id}`)
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(2);
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("body");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
        });
    });
  });
  describe("GET 400", () => {
    test("Should return a message saying when the endpoint data type is invalid", () => {
      return request(app)
        .get("/api/articles/not_an_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("GET: 404", () => {
    test("Should return an error message if the given article id doesn't exist", () => {
      const nonExistantId = 1000;
      return request(app)
        .get(`/api/articles/${nonExistantId}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article does not exist");
        });
    });
  });
});

describe("GET: /api/articles", () => {
  describe("GET: 200s", () => {
    test("Should return the articles array sorted in descending order and without a body property", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          expect(articles).toHaveLength(13);
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
          articles.forEach((article) => {
            expect(article).not.toHaveProperty("body");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("article_img_url");
          });
        });
    });
  });
  describe("GET: 400s", () => {
    test("Should return a message saying the URL endpoint is invalid", () => {
      return request(app)
        .get("/api/wrong_endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
  describe("SORT: /api/articles", () => {
    describe("SORT: 200", () => {
      test("Should allow a query to change the sort order", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            const firstArticle = articles[0];
            const lastArticle = articles[articles.length - 1];
            expect(articles).toBeSortedBy("article_id", { descending: true });
            expect(firstArticle.article_id).toBe(13);
            expect(lastArticle.article_id).toBe(1);
          });
      });
      test("Should still work if the sort query wasn't given in lowercase", () => {
        return request(app)
          .get("/api/articles?sort_by=ARTICLE_ID")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            const firstArticle = articles[0];
            const lastArticle = articles[articles.length - 1];
            expect(articles).toBeSortedBy("article_id", { descending: true });
            expect(firstArticle.article_id).toBe(13);
            expect(lastArticle.article_id).toBe(1);
          });
      });
    });
    describe("SORT: 400", () => {
      test("Should return an error message when the sort query is invalid", () => {
        return request(app)
          .get("/api/articles?sort_by=not_a_sort_query")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
    describe("SORT: 404", () => {
      test("Should return an error message when the sort query is valid but endpoint isn't", () => {
        return request(app)
          .get("/api/articlez?sort_by=author")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Invalid input");
          });
      });
    });
  });
  describe("ORDER: /api/articles", () => {
    describe("ORDER: 200", () => {
      test("Should allow a query to change the default order", () => {
        return request(app)
          .get("/api/articles?order=ASC")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            const firstArticle = articles[0];
            const lastArticle = articles[articles.length - 1];
            expect(articles).toBeSorted("created_at", { descending: false });
            expect(firstArticle.created_at).toBe("2020-11-03T09:12:00.000Z");
            expect(lastArticle.created_at).toBe("2020-01-07T14:08:00.000Z");
          });
      });
      test("Should still work if the order query was given in lowercase", () => {
        return request(app)
          .get("/api/articles?order=asc")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            const firstArticle = articles[0];
            const lastArticle = articles[articles.length - 1];
            expect(articles).toBeSorted("created_at", { descending: false });
            expect(firstArticle.created_at).toBe("2020-11-03T09:12:00.000Z");
            expect(lastArticle.created_at).toBe("2020-01-07T14:08:00.000Z");
          });
      });
    });
  });
  describe("SORT & ORDER: /api/articles", () => {
    describe("SORT & ORDER: 200", () => {
      test("Should return the article array using a sort and order query", () => {
        return request(app)
          .get("/api/articles?sort_by=votes&order=ASC")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            const firstArticle = articles[0];
            const lastArticle = articles[articles.length - 1];
            expect(firstArticle.votes).toBe(100);
            expect(lastArticle.votes).toBe(0);
            expect(articles).toBeSorted("votes", { descending: false });
          });
      });
      test("Should still work if the sort by query is uppercase and order query is lowercase", () => {
        return request(app)
          .get("/api/articles?sort_by=VOTES&order=asc")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            const firstArticle = articles[0];
            const lastArticle = articles[articles.length - 1];
            expect(firstArticle.votes).toBe(100);
            expect(lastArticle.votes).toBe(0);
            expect(articles).toBeSorted("votes", { descending: false });
          });
      });
    });
    describe("SORT & ORDER: 400", () => {
      test("Should return an error message if sort query and order query isn't valid", () => {
        return request(app)
          .get("/api/articles?sort_by=not_a_query&order=not_a_query")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad request");
          });
      });
    });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  describe("GET: 200s", () => {
    test("Should return an empty array of comments when the given article_id has no comments", () => {
      test_article_id = 2;
      return request(app)
        .get(`/api/articles/${test_article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articleComments).toEqual([]);
        });
    });
    test("Should return an array of comments when the given article_id has comments", () => {
      test_article_id = 1;
      return request(app)
        .get(`/api/articles/${test_article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          const articleComments = body.articleComments;
          expect(articleComments).toHaveLength(11);
          articleComments.forEach((articleComment) => {
            expect(articleComment).toHaveProperty(
              "comment_id",
              expect.any(Number)
            );
            expect(articleComment).toHaveProperty("body", expect.any(String));
            expect(articleComment).toHaveProperty(
              "article_id",
              expect.any(Number)
            );
            expect(articleComment).toHaveProperty("author", expect.any(String));
            expect(articleComment).toHaveProperty("votes", expect.any(Number));
            expect(articleComment).toHaveProperty(
              "created_at",
              expect.any(String)
            );
          });
        });
    });
    test("Should return the comments array in descending order", () => {
      test_article_id = 1;
      return request(app)
        .get(`/api/articles/${test_article_id}/comments`)
        .expect(200)
        .then(({ body }) => {
          const articleComments = body.articleComments;
          expect(articleComments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET: 400s", () => {
    test("Should return an error message when article_id is invalid data type", () => {
      test_article_id = "notAnId";
      return request(app)
        .get(`/api/articles/${test_article_id}/comments`)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Bad request");
        });
    });
  });
  describe("GET: 404s", () => {
    test("Should return an error message when article_id does not exist", () => {
      test_article_id = 1234;
      return request(app)
        .get(`/api/articles/${test_article_id}/comments`)
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Article does not exist");
        });
    });
  });
});

describe("GET: /api/users", () => {
  describe("GET: 200", () => {
    test("Should return an array of users when this endpoint is navigated to", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const users = body.users;
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username", expect.any(String));
            expect(user).toHaveProperty("name", expect.any(String));
            expect(user).toHaveProperty("avatar_url", expect.any(String));
          });
        });
    });
  });
  describe("GET: 400", () => {
    test("Should return an error message when the endpoint is invalid", () => {
      return request(app)
        .get("/api/userz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  describe("POST: 201s", () => {
    test("Should successfully post a new comment to the given article id", () => {
      const addedComment = {
        username: "lurker",
        body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
      };
      const comment = {
        body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
        votes: 123,
        author: "lurker",
        article_id: 3,
      };
      test_article_id = 3;
      return request(app)
        .post(`/api/articles/${test_article_id}/comments`)
        .send(addedComment)
        .expect(201)
        .then(({ body }) => {
          const newComment = body.newComment;
          expect(newComment.body).toBe(comment.body);
          expect(newComment.comment_id).toBe(19);
          expect(newComment.article_id).toBe(3);
          expect(newComment.author).toBe("lurker");
          expect(newComment).toHaveProperty("created_at");
          expect(newComment).toHaveProperty("votes");
        });
    });
    test("Should successfully post a new comment when it has extra properties", () => {
      const addedComment = {
        username: "lurker",
        body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
        author: "lurker",
        name: "Please work",
      };
      const comment = {
        body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
        votes: 123,
        article_id: 3,
      };
      test_article_id = 3;
      return request(app)
        .post(`/api/articles/${test_article_id}/comments`)
        .send(addedComment)
        .expect(201)
        .then(({ body }) => {
          const newComment = body.newComment;
          expect(newComment.body).toBe(comment.body);
          expect(newComment.comment_id).toBe(19);
          expect(newComment.article_id).toBe(3);
          expect(newComment).toHaveProperty("created_at");
          expect(newComment).toHaveProperty("votes");
        });
    });
  });
  describe("POST: 400s", () => {
    test("Should return an error message when the article_id type is invalid", () => {
      const addedComment = {
        username: "lurker",
        body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
      };
      return request(app)
        .post("/api/articles/notAnId/comments")
        .send(addedComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("Should return an error message when there is no given properties", () => {
      const addedComment = {};
      test_article_id = 3;
      return request(app)
        .post(`/api/articles/${test_article_id}/comments`)
        .send(addedComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("Should return an error message when article id does not exist", () => {
      const addedComment = {
        username: "notValid",
        body: "This should not work",
      };
      test_article_id = 3;
      return request(app)
        .post(`/api/articles/${test_article_id}/comments`)
        .send(addedComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("POST: 404s", () => {
    test("Should return an error message when article id does not exist", () => {
      const addedComment = {
        username: "lurker",
        body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
      };
      test_article_id = 1000;
      return request(app)
        .post(`/api/articles/${test_article_id}/comments`)
        .send(addedComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article does not exist");
        });
    });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  describe("PATCH: 202", () => {
    test("Should increase the vote property and return the updated article", () => {
      const updatedVotes = { inc_votes: 10 };
      test_article_id = 3;
      return request(app)
        .patch(`/api/articles/${test_article_id}`)
        .expect(202)
        .send(updatedVotes)
        .then(({ body }) => {
          const updatedArticle = body.updatedArticle;
          expect(updatedArticle.article_id).toBe(3);
          expect(updatedArticle.title).toBe(
            "Eight pug gifs that remind me of mitch"
          );
          expect(updatedArticle.topic).toBe("mitch");
          expect(updatedArticle.author).toBe("icellusedkars");
          expect(updatedArticle.body).toBe("some gifs");
          expect(updatedArticle.created_at).toBe("2020-11-03T09:12:00.000Z");
          expect(updatedArticle.votes).toBe(10);
          expect(updatedArticle.article_img_url).toBe(
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
          );
        });
    });
  });
  describe("PATCH: 400s", () => {
    test("Should return an error message when the key is invalid", () => {
      const updatedVotes = { wrong_key: 10 };
      test_article_id = 3;
      return request(app)
        .patch(`/api/articles/${test_article_id}`)
        .expect(400)
        .send(updatedVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("Should return an error message when the given key/prop is missing", () => {
      const updatedVotes = "10";
      test_article_id = 3;
      return request(app)
        .patch(`/api/articles/${test_article_id}`)
        .expect(400)
        .send(updatedVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("Should return an error message when the given article id is invalid", () => {
      const updatedVotes = { inc_votes: 10 };
      return request(app)
        .patch("/api/articles/notAnId")
        .expect(400)
        .send(updatedVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("PATCH: 404", () => {
    test("Should return an error message when the given article id doesn't exist", () => {
      const updatedVotes = { inc_votes: 10 };
      test_article_id = 1000;
      return request(app)
        .patch(`/api/articles/${test_article_id}`)
        .expect(404)
        .send(updatedVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("Article does not exist");
        });
    });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  describe("DELETE: 202", () => {
    test("Should successfully delete the comment with the id given", () => {
      test_comment_id = 3;
      return request(app)
        .delete(`/api/comments/${test_comment_id}`)
        .expect(202)
        .then(({ body }) => {
          expect(body.msg).toBe("Comment deleted");
        });
    });
  });
  describe("DELETE: 204", () => {
    test("Should return an error message when the comment id does not exist", () => {
      const test_comment_id = 9999;
      return request(app)
        .delete(`/api/comments/${test_comment_id}`)
        .expect(404);
    });
  });
  describe("DELETE: 400", () => {
    test("Should return an error message when the comment id is an invalid type", () => {
      return request(app).delete("/api/comments/notAnId").expect(400);
    });
  });
});
