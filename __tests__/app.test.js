const app = require("../db/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");
const { toBeSortedBy } = require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

let test_article_id = 1;

describe("GET: /api/topics", () => {
  test("Should return an array of objects containing topics slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
      });
  });
});

describe("GET: /api", () => {
  test("GET: 200 - returns with valid endpoints that are available for users", () => {
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

describe("GET: 200 /api/articles/:article_id", () => {
  test("Should return the details for article 1 as that is the endpoint being navigated to", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(1);
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
      });
  });
  test("Should return the details for article 2 as that is the endpoint being navigated to", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(2);
        expect(body.article).toHaveProperty("article_id");
        expect(body.article).toHaveProperty("title");
        expect(body.article).toHaveProperty("topic");
        expect(body.article).toHaveProperty("author");
        expect(body.article).toHaveProperty("body");
        expect(body.article).toHaveProperty("created_at");
        expect(body.article).toHaveProperty("votes");
        expect(body.article).toHaveProperty("article_img_url");
      });
  });
  describe("GET: 404 /api/articles/:article_id", () => {
    test("Should return a message saying the article id does not exist", () => {
      const nonExistantId = 1000;
      return request(app)
        .get(`/api/articles/${nonExistantId}`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article does not exist");
        });
    });
  });
  describe("GET 400: /api/articles/:article_id", () => {
    test("Should return a message saying when the endpoint data type is invalid", () => {
      return request(app)
        .get("/api/articles/not_an_id")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
});

describe("GET: 200 /api/articles", () => {
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
  describe("GET: 400 /api/articles", () => {
    test("Should return a message saying the URL endpoint is invalid", () => {
      return request(app)
        .get("/api/wrong_endpoint")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid input");
        });
    });
  });
});

describe("GET: 200 /api/articles/:article_id/comments", () => {
  test("Should return an empty array of comments when the given article_id has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.articleComments).toEqual([]);
      });
  });
  test("Should return an array of comments when the given article_id has comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
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
  describe("GET: 200 /api/articles/:article_id/comments", () => {
    test("Should return the comments array in descending order", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const articleComments = body.articleComments;
          expect(articleComments).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET: 404 /api/articles/:article_id/comments", () => {
    test("Should return an error message when article_id does not exist", () => {
      return request(app)
        .get("/api/articles/1234/comments")
        .expect(404)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Article does not exist");
        });
    });
  });
  describe("GET: 400 /api/articles/:article_id/comments", () => {
    test("Should return an error message when article_id is invalid data type", () => {
      return request(app)
        .get("/api/articles/notAnId/comments")
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Bad request");
        });
    });
  });
});

describe("POST METHODS /api/articles/:article_id/comments", () => {
  describe("POST: 201", () => {
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
  describe("POST: 400", () => {
    test("Should return an error message when the article_id type is invalid", () => {
      const addedComment = {
        username: "lurker",
        body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
      };
      test_article_id = "notAnId";
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
  describe("POST: 404", () => {
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
