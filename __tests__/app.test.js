const app = require("../src/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../src/endpoints.json");
require("jest-sorted");
let test_article_id = 1;
let test_comment_id = 1;

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET: /api", () => {
  test("Should return with endpoints that are valid paths", () => {
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

describe("GET: /api/topics", () => {
  test("Should return an array of topics", () => {
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
  describe("GET: /api/topics/:slug", () => {
    test("Should return a topic by its slug", async () => {
      const response = await request(app).get("/api/topics/mitch").expect(200);
      const { topic } = response.body;
      expect(topic).toHaveProperty("slug", expect.any(String));
      expect(topic).toHaveProperty("description", expect.any(String));
    });
    test("Should return an error message when slug does not exist", async () => {
      const response = await request(app)
        .get("/api/topics/doesnotexist")
        .expect(404);
      const { msg } = response.body;
      expect(msg).toBe("Topic doesn't exist");
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
});

describe("GET: /api/users/:username", () => {
  describe("GET: 200", () => {
    test("Should return a username based on parameter used", () => {
      return request(app)
        .get("/api/users/icellusedkars")
        .then(({ body }) => {
          const user = body.user;
          expect(user).toHaveProperty("username", "icellusedkars");
          expect(user).toHaveProperty("name", "sam");
          expect(user).toHaveProperty(
            "avatar_url",
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
          );
        });
    });
  });
  describe("GET: 404", () => {
    test("Should return an error message when username is not found", () => {
      return request(app)
        .get("/api/users/Username_doesnt_exist_yet")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User does not exist");
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
          expect(body).toHaveProperty("total_count", expect.any(Number));
          expect(articles).toHaveLength(10);
          expect(articles).toBeSorted("created_at", {
            descending: true,
          });
          articles.forEach((article) => {
            expect(article).not.toHaveProperty("body", expect.any(String));
            expect(article).toHaveProperty("article_id", expect.any(Number));
            expect(article).toHaveProperty("title", expect.any(String));
            expect(article).toHaveProperty("topic", expect.any(String));
            expect(article).toHaveProperty("author", expect.any(String));
            expect(article).toHaveProperty("created_at", expect.any(String));
            expect(article).toHaveProperty("votes", expect.any(Number));
            expect(article).toHaveProperty(
              "article_img_url",
              expect.any(String)
            );
            expect(article).toHaveProperty("comment_count", expect.any(Number));
          });
        });
    });
  });
  describe("SORT: /api/articles", () => {
    describe("SORT: 200", () => {
      test("Should allow the sort query to be changed", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).toBeSorted("article_id", { descending: true });
          });
      });
      test("Should allow the topic query to be changed", () => {
        return request(app)
          .get("/api/articles?topic=cats")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            articles.forEach((article) => {
              expect(article.topic).toBe("cats");
            });
          });
      });
      test("Should allow the order query to be changed", () => {
        return request(app)
          .get("/api/articles?order=ASC")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).toBeSorted("created_at", { descending: false });
          });
      });
      test("Should work if the topic queried had no relevant articles", () => {
        return request(app)
          .get("/api/articles?topic=paper")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).toEqual([]);
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
            expect(articles).toBeSorted("article_id", { descending: true });
            expect(firstArticle.article_id).toBe(13);
            expect(lastArticle.article_id).toBe(4);
          });
      });
      test("Should still work if sort_by input was wrong", () => {
        return request(app)
          .get("/api/articles?sot_by=votes")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles).toBeSorted("created_at", { descending: true });
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
      test("Should return an error message when the topic does not exist", () => {
        return request(app)
          .get("/api/topic=thistookwaytoolonglol")
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
            expect(firstArticle.created_at).toBe("2020-01-07T14:08:00.000Z");
            expect(lastArticle.created_at).toBe("2020-10-11T11:24:00.000Z");
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
            expect(firstArticle.created_at).toBe("2020-01-07T14:08:00.000Z");
            expect(lastArticle.created_at).toBe("2020-10-11T11:24:00.000Z");
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
            expect(firstArticle.votes).toBe(0);
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
            expect(firstArticle.votes).toBe(0);
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
  describe("PAGINATION: /api/articles", () => {
    describe("PAGINATION: 200", () => {
      test("Should return the articles using all the queries including pagination", () => {
        return request(app)
          .get("/api/articles?sort_by=article_id&order=asc&limit=5&p=1")
          .expect(200)
          .then(({ body }) => {
            const articles = body.articles;
            expect(articles[0]).toHaveProperty("article_id", 1);
            expect(articles[articles.length - 1]).toHaveProperty(
              "article_id",
              5
            );
          });
      });
    });
    describe("PAGINATION: 400", () => {
      test("Should return an error message when the limit query isn't valid", () => {
        return request(app)
          .get("/api/articles?limit=drycode")
          .expect(400)
          .then(({ body }) => {
            const errMsg = body.msg;
            expect(errMsg).toBe("Bad request");
          });
      });
      test("Should return an error message when the p query isn't valid", () => {
        return request(app)
          .get("/api/articles?p=thinkoutsidethebox")
          .expect(400)
          .then(({ body }) => {
            const errMsg = body.msg;
            expect(errMsg).toBe("Bad request");
          });
      });
      test("Should return an error message when both pagination queries aren't valid", () => {
        return request(app)
          .get("/api/articles?limit=drycode&p=thinkoutsidethebox")
          .expect(400)
          .then(({ body }) => {
            const errMsg = body.msg;
            expect(errMsg).toBe("Bad request");
          });
      });
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
    test("Should return article 3 with the total comment count on it", () => {
      test_article_id = 3;
      return request(app)
        .get(`/api/articles/${test_article_id}`)
        .expect(200)
        .then(({ body }) => {
          const article = body.article;
          expect(article.article_id).toBe(3);
          expect(article).toHaveProperty("comment_count", 2);
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
          expect(articleComments).toBeSorted("created_at", {
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

describe("POST: /api/topics", () => {
  describe("POST: 201", () => {
    test("Should post a new topic to the topics", () => {
      const addedTopic = {
        slug: "Web Development",
        description: "How do I center this div?",
      };
      return request(app)
        .post("/api/topics")
        .send(addedTopic)
        .expect(201)
        .then(({ body }) => {
          const newTopic = body.newTopic;
          expect(newTopic).toHaveProperty("slug", "Web Development");
          expect(newTopic).toHaveProperty(
            "description",
            "How do I center this div?"
          );
        });
    });
  });
  describe("POST: 400", () => {
    test("Should return an error message when there are no topic properties given", () => {
      const addedTopic = {};
      return request(app)
        .post("/api/topics")
        .send(addedTopic)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Bad request");
        });
    });
    test("Should not allow a duplicated topic", () => {
      const topicOne = {
        slug: "Web Development",
        description: "How do I center this div?",
      };
      const topicTwo = {
        slug: "Web Development",
        description: "How do I center this div?",
      };
      return request(app)
        .post("/api/topics")
        .send(topicOne)
        .expect(201)
        .then(() => {
          return request(app)
            .post("/api/topics")
            .send(topicTwo)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Topic already exists");
            });
        });
    });
  });
});

describe("POST: /api/users", () => {
  test("Should successfully create a new user", async () => {
    const addedUser = {
      username: "TTibbs",
      name: "Terry Tibbs",
      avatar_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShodwK4XXhzGwuXsOxi1eQ6ZRefzQNdPnbLTWR0LspxCuHmfDAIcIyvAcySwlwQRhLfFE&usqp=CAU",
    };
    const response = await request(app)
      .post("/api/users")
      .send(addedUser)
      .expect(201);
    const { newUser } = response.body;
    expect(newUser).toHaveProperty("username", "TTibbs");
    expect(newUser).toHaveProperty("name", "Terry Tibbs");
    expect(newUser).toHaveProperty("avatar_url", expect.any(String));
  });
  test("Should return a 400 status code and error message if the sent user has missing fields", async () => {
    const addedUser = {
      username: "TTibbs",
      avatar_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShodwK4XXhzGwuXsOxi1eQ6ZRefzQNdPnbLTWR0LspxCuHmfDAIcIyvAcySwlwQRhLfFE&usqp=CAU",
    };
    const response = await request(app)
      .post("/api/users")
      .send(addedUser)
      .expect(400);
    const { msg } = response.body;
    expect(msg).toBe("Bad request");
  });
  test("Should return a 400 status code and error message if the sent user has no fields", async () => {
    const response = await request(app).post("/api/users").send().expect(400);
    const { msg } = response.body;
    expect(msg).toBe("Bad request");
  });
  test("Should not allow multiple usernames to exist", async () => {
    const user = {
      username: "TTibbs",
      name: "Terry Tibbs",
      avatar_url: "https://example.com/avatar.jpg",
    };
    await request(app).post("/api/users").send(user).expect(201);
    const response = await request(app)
      .post("/api/users")
      .send(user)
      .expect(409);
    const { msg } = response.body;
    expect(msg).toBe("Username already exists");
  });
});

describe("POST: /api/articles", () => {
  describe("POST: 201", () => {
    test("Should create a new article", () => {
      const addedArticle = {
        title: "How I became a full stack developer",
        topic: "mitch",
        author: "lurker",
        body: "I found these great people called Northcoders",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .post("/api/articles")
        .send(addedArticle)
        .expect(201)
        .then(({ body }) => {
          const newArticle = body.newArticle;
          expect(newArticle).toHaveProperty(
            "body",
            "I found these great people called Northcoders"
          );
        });
    });
  });
  describe("POST: 400", () => {
    test("Should return an error message when there is no given properties", () => {
      const addedArticle = {};
      return request(app)
        .post("/api/articles")
        .send(addedArticle)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Bad request");
        });
    });
    test("Should return an error message if the properties aren't correct", () => {
      const addedArticle = {
        title: "Invalid topic test",
        topic: 1,
        author: "lurker",
        body: "Is this overkill?",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      return request(app)
        .post("/api/articles")
        .send(addedArticle)
        .expect(400)
        .then(({ body }) => {
          const errMsg = body.msg;
          expect(errMsg).toBe("Bad request");
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
        .post("/api/articles/1000/comments")
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

describe("PATCH: /api/comments/:comment_id", () => {
  describe("PATCH: 202", () => {
    test("Should increase the votes on a comment", () => {
      const updatedVotes = { inc_votes: 10 };
      test_comment_id = 1;
      return request(app)
        .patch(`/api/comments/${test_comment_id}`)
        .send(updatedVotes)
        .then(({ body }) => {
          const updatedComment = body.updatedComment;
          expect(updatedComment).toHaveProperty("comment_id", 1);
          expect(updatedComment).toHaveProperty(
            "body",
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          );
          expect(updatedComment).toHaveProperty("votes", 26);
        });
    });
    test("Should decrease the votes on a comment", () => {
      const updatedVotes = { inc_votes: -10 };
      test_comment_id = 1;
      return request(app)
        .patch(`/api/comments/${test_comment_id}`)
        .send(updatedVotes)
        .then(({ body }) => {
          const updatedComment = body.updatedComment;
          expect(updatedComment).toHaveProperty("comment_id", 1);
          expect(updatedComment).toHaveProperty(
            "body",
            "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
          );
          expect(updatedComment).toHaveProperty("votes", 6);
        });
    });
  });
  describe("PATCH: 400s", () => {
    test("Should return an error message when the key is invalid", () => {
      const updatedVotes = { wrong_key: 10 };
      test_comment_id = 3;
      return request(app)
        .patch(`/api/comments/${test_comment_id}`)
        .expect(400)
        .send(updatedVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("Should return an error message when the given key/prop is missing", () => {
      const updatedVotes = "10";
      test_comment_id = 3;
      return request(app)
        .patch(`/api/comments/${test_comment_id}`)
        .expect(400)
        .send(updatedVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
    test("Should return an error message when the given comment id is invalid", () => {
      const updatedVotes = { inc_votes: 10 };
      return request(app)
        .patch("/api/comments/notAnId")
        .expect(400)
        .send(updatedVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad request");
        });
    });
  });
  describe("PATCH: 404", () => {
    test("Should return an error message when the given comment id doesn't exist", () => {
      const updatedVotes = { inc_votes: 10 };
      test_comment_id = 1000;
      return request(app)
        .patch(`/api/comments/${test_comment_id}`)
        .expect(404)
        .send(updatedVotes)
        .then(({ body }) => {
          expect(body.msg).toBe("Article does not exist");
        });
    });
  });
});

describe("DELETE: /api/articles/:article_id", () => {
  describe("DELETE 204", () => {
    test("Should successfully delete the article with the id given and the comments", () => {
      return request(app).delete("/api/articles/5").expect(204);
    });
  });
  describe("DELETE 400", () => {
    test("Should successfully delete the article with the id given", () => {
      return request(app).delete("/api/articles/not_an_id").expect(400);
    });
  });
  describe("DELETE 404", () => {
    test("Should successfully delete the article with the id given", () => {
      return request(app).delete("/api/articles/40404").expect(404);
    });
  });
});

describe("DELETE: /api/comments/:comment_id", () => {
  describe("DELETE: 204", () => {
    test("Should successfully delete the comment with the id given", () => {
      test_comment_id = 3;
      return request(app)
        .delete(`/api/comments/${test_comment_id}`)
        .expect(204);
    });
  });
  describe("DELETE: 404", () => {
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
