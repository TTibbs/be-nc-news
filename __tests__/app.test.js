const app = require("../src/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../src/endpoints.json");
require("jest-sorted");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("API Endpoints", () => {
  test("Should return with endpoints that are valid paths", async () => {
    const response = await request(app).get("/api").expect(200);
    const { body } = response;
    const testEndPoints = body.endpoints;
    expect(testEndPoints).toEqual(endpoints);
    expect(typeof body.endpoints).toBe("object");
  });
});

describe("Users Endpoints", () => {
  describe("GET: /api/users", () => {
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
  describe("GET: /api/users/:username", () => {
    test("Should successfully return a user based on the username parameter", async () => {
      const response = await request(app)
        .get("/api/users/icellusedkars")
        .expect(200);
      const { user } = response.body;
      expect(user).toHaveProperty("username", "icellusedkars");
      expect(user).toHaveProperty("name", "sam");
      expect(user).toHaveProperty(
        "avatar_url",
        "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4"
      );
    });
    test("Should return an error message when username is not found", async () => {
      const response = await request(app)
        .get("/api/users/Username_doesnt_exist_yet")
        .expect(404);
      const { msg } = response.body;
      expect(msg).toBe("User does not exist");
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
  describe("PATCH: /api/users/:username", () => {
    test("Should successfully update a user by the username given", async () => {
      const userUpdate = {
        name: "Terry Tibbs",
        avatar_url: "https://example.com/avatar.jpg",
      };
      const response = await request(app)
        .patch("/api/users/icellusedkars")
        .send(userUpdate)
        .expect(200);
      const { updatedUser } = response.body;
      expect(updatedUser).toHaveProperty("username", "icellusedkars");
      expect(updatedUser).toHaveProperty("name", "Terry Tibbs");
      expect(updatedUser).toHaveProperty(
        "avatar_url",
        "https://example.com/avatar.jpg"
      );
    });
    test("Should return a 400 status code and error message when no valid fields are given", async () => {
      const userUpdate = {};
      const response = await request(app)
        .patch("/api/users/icellusedkars")
        .send(userUpdate)
        .expect(400);
      const { msg } = response.body;
      expect(msg).toBe("No valid fields to update");
    });
    test("Should return a 404 status code and error message when the user username does not exist", async () => {
      const userUpdate = {
        name: "Terry Tibbs",
        avatar_url: "https://example.com/avatar.jpg",
      };
      const response = await request(app)
        .patch("/api/users/doesnotexist")
        .send(userUpdate)
        .expect(404);
      const { msg } = response.body;
      expect(msg).toBe("User does not exist");
    });
    test("Should return a 409 status code and error message when the username already exists", async () => {
      const userUpdate = {
        username: "lurker",
        name: "do_nothing",
        avatar_url: "https://example.com/avatar.jpg",
      };
      const response = await request(app)
        .patch("/api/users/icellusedkars")
        .send(userUpdate)
        .expect(409);
      const { msg } = response.body;
      expect(msg).toBe("Username already exists");
    });
  });
  describe("DELETE: /api/users/:username", () => {
    test("Should delete a user by the username given", async () => {
      const response = await request(app)
        .delete("/api/users/lurker")
        .expect(204);
    });
    test("Should return a 404 status and error message when the user username does not exist", async () => {
      const response = await request(app)
        .delete("/api/users/doesnotexist")
        .expect(404);
      const { msg } = response.body;
      expect(msg).toBe("User does not exist");
    });
  });
});

describe("Topics Endpoints", () => {
  describe("GET: /api/topics", () => {
    test("Should return an array of topics", async () => {
      const response = await request(app).get("/api/topics").expect(200);
      const { topics } = response.body;
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
  describe("POST: /api/topics", () => {
    test("Should post a new topic to the topics", async () => {
      const addedTopic = {
        slug: "Web Development",
        description: "How do I center this div?",
      };
      const response = await request(app)
        .post("/api/topics")
        .send(addedTopic)
        .expect(201);
      const { newTopic } = response.body;
      expect(newTopic).toHaveProperty("slug", "Web Development");
      expect(newTopic).toHaveProperty(
        "description",
        "How do I center this div?"
      );
    });
    test("Should return an error message when there are no topic properties given", async () => {
      const addedTopic = {};
      const response = await request(app)
        .post("/api/topics")
        .send(addedTopic)
        .expect(400);
      const { msg } = response.body;
      expect(msg).toBe("Bad request");
    });
    test("Should not allow a duplicated topic", async () => {
      const topicOne = {
        slug: "Web Development",
        description: "How do I center this div?",
      };
      const topicTwo = {
        slug: "Web Development",
        description: "How do I center this div?",
      };
      await request(app).post("/api/topics").send(topicOne).expect(201);
      const responseTwo = await request(app)
        .post("/api/topics")
        .send(topicTwo)
        .expect(400);
      const { msg } = responseTwo.body;
      expect(msg).toBe("Topic already exists");
    });
  });
  describe("DELETE: /api/topics/:slug", () => {
    test("Should delete a topic by the slug given", () => {
      return request(app).delete("/api/topics/paper").expect(204);
    });
    test("Should delete related articles when a topic is deleted", async () => {
      await request(app).delete("/api/topics/mitch").expect(204);
      const response = await request(app).get("/api/articles").expect(200);
      const { articles } = response.body;
      expect(articles).toHaveLength(1);
    });
    test("Should return a 404 status and error message when the topic slug does not exist", () => {
      return request(app).delete("/api/topics/doesnotexist").expect(404);
    });
  });
});

describe("Articles Endpoints", () => {
  describe("GET: /api/articles", () => {
    test("Should return the articles array sorted in descending order and without a body property", async () => {
      const response = await request(app).get("/api/articles").expect(200);
      const { articles } = response.body;
      expect(articles).toHaveLength(12);
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
        expect(article).toHaveProperty("article_img_url", expect.any(String));
        expect(article).toHaveProperty("comment_count", expect.any(Number));
      });
    });
    describe("SORT: /api/articles", () => {
      test("Should allow the sort query to be changed", async () => {
        const response = await request(app)
          .get("/api/articles?sort_by=article_id")
          .expect(200);
        const { articles } = response.body;
        expect(articles).toBeSorted("article_id", { descending: true });
      });
      test("Should allow the topic query to be changed", async () => {
        const response = await request(app)
          .get("/api/articles?topic=cats")
          .expect(200);
        const { articles } = response.body;
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
      test("Should allow the order query to be changed", async () => {
        const response = await request(app)
          .get("/api/articles?order=ASC")
          .expect(200);
        const { articles } = response.body;
        expect(articles).toBeSorted("created_at", { descending: false });
      });
      test("Should work if the topic queried had no relevant articles", async () => {
        const response = await request(app)
          .get("/api/articles?topic=paper")
          .expect(200);
        const { articles } = response.body;
        expect(articles).toEqual([]);
      });
      test("Should still work if the sort query wasn't given in lowercase", async () => {
        const response = await request(app)
          .get("/api/articles?sort_by=ARTICLE_ID")
          .expect(200);
        const { articles } = response.body;
        const firstArticle = articles[0];
        const lastArticle = articles[articles.length - 1];
        expect(articles).toBeSorted("article_id", { descending: true });
        expect(firstArticle.article_id).toBe(13);
        expect(lastArticle.article_id).toBe(2);
      });
      test("Should still work if sort_by input was wrong", async () => {
        const response = await request(app)
          .get("/api/articles?sot_by=votes")
          .expect(200);
        const { articles } = response.body;
        expect(articles).toBeSorted("created_at", { descending: true });
      });
      test("Should return an error message when the sort query is invalid", async () => {
        const response = await request(app)
          .get("/api/articles?sort_by=not_a_sort_query")
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return an error message when the topic does not exist", async () => {
        const response = await request(app)
          .get("/api/topic=thistookwaytoolonglol")
          .expect(404);
        const { msg } = response.body;
        expect(msg).toBe("Invalid input");
      });
    });
    describe("ORDER: /api/articles", () => {
      test("Should allow a query to change the default order", async () => {
        const response = await request(app)
          .get("/api/articles?order=ASC")
          .expect(200);
        const { articles } = response.body;
        const firstArticle = articles[0];
        const lastArticle = articles[articles.length - 1];
        expect(articles).toBeSorted("created_at", { descending: false });
        expect(firstArticle.created_at).toBe("2020-01-07T14:08:00.000Z");
        expect(lastArticle.created_at).toBe("2020-10-18T01:00:00.000Z");
      });
      test("Should still work if the order query was given in lowercase", async () => {
        const response = await request(app)
          .get("/api/articles?order=asc")
          .expect(200);
        const { articles } = response.body;
        const firstArticle = articles[0];
        const lastArticle = articles[articles.length - 1];
        expect(articles).toBeSorted("created_at", { descending: false });
        expect(firstArticle.created_at).toBe("2020-01-07T14:08:00.000Z");
        expect(lastArticle.created_at).toBe("2020-10-18T01:00:00.000Z");
      });
    });
    describe("SORT & ORDER: /api/articles", () => {
      test("Should return the article array using a sort and order query", async () => {
        const response = await request(app)
          .get("/api/articles?sort_by=votes&order=ASC")
          .expect(200);
        const { articles } = response.body;
        const firstArticle = articles[0];
        const lastArticle = articles[articles.length - 1];
        expect(firstArticle.votes).toBe(0);
        expect(lastArticle.votes).toBe(0);
        expect(articles).toBeSorted("votes", { descending: false });
      });
      test("Should still work if the sort by query is uppercase and order query is lowercase", async () => {
        const response = await request(app)
          .get("/api/articles?sort_by=VOTES&order=asc")
          .expect(200);
        const { articles } = response.body;
        const firstArticle = articles[0];
        const lastArticle = articles[articles.length - 1];
        expect(firstArticle.votes).toBe(0);
        expect(lastArticle.votes).toBe(0);
        expect(articles).toBeSorted("votes", { descending: false });
      });
      test("Should return an error message if sort query and order query isn't valid", async () => {
        const response = await request(app)
          .get("/api/articles?sort_by=not_a_query&order=not_a_query")
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
    });
    describe("PAGINATION: /api/articles", () => {
      test("Should return the articles using all the queries including pagination", async () => {
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
      test("Should return an error message when the limit query isn't valid", async () => {
        const response = await request(app)
          .get("/api/articles?limit=drycode")
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return an error message when the p query isn't valid", async () => {
        const response = await request(app)
          .get("/api/articles?p=thinkoutsidethebox")
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return an error message when both pagination queries aren't valid", async () => {
        const response = await request(app)
          .get("/api/articles?limit=drycode&p=thinkoutsidethebox")
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
    });
    describe("GET: /api/articles/:article_id", () => {
      test("Should return the details for article 1 as that is the endpoint being navigated to", async () => {
        const response = await request(app).get(`/api/articles/1`).expect(200);
        const { article } = response.body;
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
      test("Should return the details for article 2 as that is the endpoint being navigated to", async () => {
        const response = await request(app).get(`/api/articles/2`).expect(200);
        const { article } = response.body;
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
      test("Should return article 3 with the total comment count on it", async () => {
        const response = await request(app).get(`/api/articles/3`).expect(200);
        const { article } = response.body;
        expect(article.article_id).toBe(3);
        expect(article).toHaveProperty("comment_count", 2);
      });
      test("Should return a message saying when the endpoint data type is invalid", async () => {
        const response = await request(app)
          .get("/api/articles/not_an_id")
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return an error message if the given article id doesn't exist", async () => {
        const response = await request(app)
          .get(`/api/articles/9999`)
          .expect(404);
        const { msg } = response.body;
        expect(msg).toBe("Article does not exist");
      });
    });
  });
  describe("POST: /api/articles", () => {
    test("Should create a new article", async () => {
      const addedArticle = {
        title: "How I became a full stack developer",
        topic: "mitch",
        author: "lurker",
        body: "I found these great people called Northcoders",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      const response = await request(app)
        .post("/api/articles")
        .send(addedArticle)
        .expect(201);
      const { newArticle } = response.body;
      expect(newArticle).toHaveProperty(
        "body",
        "I found these great people called Northcoders"
      );
    });
    test("Should return an error message when there is no given properties", async () => {
      const addedArticle = {};
      const response = await request(app)
        .post("/api/articles")
        .send(addedArticle)
        .expect(400);
      const { msg } = response.body;
      expect(msg).toBe("Bad request");
    });
    test("Should return an error message if the properties aren't correct", async () => {
      const addedArticle = {
        title: "Invalid topic test",
        topic: 1,
        author: "lurker",
        body: "Is this overkill?",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      };
      const response = await request(app)
        .post("/api/articles")
        .send(addedArticle)
        .expect(400);
      const { msg } = response.body;
      expect(msg).toBe("Bad request");
    });
  });
  describe("PATCH: /api/articles/:article_id", () => {
    test("Should increase the vote property and return the updated article", async () => {
      const updatedVotes = { inc_votes: 10 };
      const response = await request(app)
        .patch(`/api/articles/3`)
        .expect(202)
        .send(updatedVotes);
      const { updatedArticle } = response.body;
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
    test("Should return a 400 status code and an error message when the key is invalid", async () => {
      const updatedVotes = { wrong_key: 10 };
      const response = await request(app)
        .patch(`/api/articles/3`)
        .expect(400)
        .send(updatedVotes);
      const { msg } = response.body;
      expect(msg).toBe("Bad request");
    });
    test("Should return a 400 status code and an error message when the given key/prop is missing", async () => {
      const updatedVotes = "10";
      const response = await request(app)
        .patch(`/api/articles/3`)
        .expect(400)
        .send(updatedVotes);
      const { msg } = response.body;
      expect(msg).toBe("Bad request");
    });
    test("Should return a 400 status code and an error message when the given article id is invalid", async () => {
      const updatedVotes = { inc_votes: 10 };
      const response = await request(app)
        .patch("/api/articles/notAnId")
        .expect(400)
        .send(updatedVotes);
      const { msg } = response.body;
      expect(msg).toBe("Bad request");
    });
    test("Should return a 404 status code and an error message when the given article id doesn't exist", async () => {
      const updatedVotes = { inc_votes: 10 };
      const response = await request(app)
        .patch(`/api/articles/1000`)
        .expect(404)
        .send(updatedVotes);
      const { msg } = response.body;
      expect(msg).toBe("Article does not exist");
    });
  });
  describe("DELETE: /api/articles/:article_id", () => {
    test("Should successfully delete the article with the id given and the comments", async () => {
      await request(app).delete("/api/articles/5").expect(204);
      const response = await request(app).get("/api/articles/5").expect(404);
      const { msg } = response.body;
      expect(msg).toBe("Article does not exist");
    });
    test("Should return a 400 status code and an error message when the article ID is invalid", () => {
      return request(app).delete("/api/articles/not_an_id").expect(400);
    });
    test("Should return a 404 status code and an error message when the article ID does not exist", () => {
      return request(app).delete("/api/articles/40404").expect(404);
    });
  });
});

describe("Comments Endpoints", () => {
  describe("GET: /api/comments", () => {
    test("Should return an array of comments", async () => {
      const response = await request(app).get("/api/comments").expect(200);
      const { comments } = response.body;
      expect(comments).toBeInstanceOf(Array);
      expect(comments.length).toBeGreaterThan(0);
    });
  });
  describe("/api/comments/:comment_id", () => {
    describe("GET: /api/articles/:article_id/comments", () => {
      test("Should return an empty array of comments when the given article_id has no comments", async () => {
        const response = await request(app)
          .get(`/api/articles/2/comments`)
          .expect(200);
        const { articleComments } = response.body;
        expect(articleComments).toEqual([]);
      });
      test("Should return an array of comments when the given article_id has comments", async () => {
        const response = await request(app)
          .get(`/api/articles/1/comments`)
          .expect(200);
        const { articleComments } = response.body;
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
      test("Should return the comments array in descending order", async () => {
        const response = await request(app)
          .get(`/api/articles/1/comments`)
          .expect(200);
        const { articleComments } = response.body;
        expect(articleComments).toBeSorted("created_at", {
          descending: true,
        });
      });
      test("Should return an error message when article_id is invalid data type", async () => {
        const response = await request(app)
          .get(`/api/articles/notAnId/comments`)
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return an error message when article_id does not exist", async () => {
        const response = await request(app)
          .get(`/api/articles/1234/comments`)
          .expect(404);
        const { msg } = response.body;
        expect(msg).toBe("Article does not exist");
      });
    });
    describe("PATCH: /api/comments/:comment_id", () => {
      test("Should increase the votes on a comment", async () => {
        const updatedVotes = { inc_votes: 10 };
        const response = await request(app)
          .patch(`/api/comments/1`)
          .send(updatedVotes);
        const { updatedComment } = response.body;
        expect(updatedComment).toHaveProperty("comment_id", 1);
        expect(updatedComment).toHaveProperty(
          "body",
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        );
        expect(updatedComment).toHaveProperty("votes", 26);
      });
      test("Should decrease the votes on a comment", async () => {
        const updatedVotes = { inc_votes: -10 };
        const response = await request(app)
          .patch(`/api/comments/1`)
          .send(updatedVotes);
        const { updatedComment } = response.body;
        expect(updatedComment).toHaveProperty("comment_id", 1);
        expect(updatedComment).toHaveProperty(
          "body",
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        );
        expect(updatedComment).toHaveProperty("votes", 6);
      });
      test("Should return a 400 status code and an error message when the key is invalid", async () => {
        const updatedVotes = { wrong_key: 10 };
        const response = await request(app)
          .patch(`/api/comments/1`)
          .expect(400)
          .send(updatedVotes);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return a 400 status code and an error message when the given key/prop is missing", async () => {
        const updatedVotes = "10";
        const response = await request(app)
          .patch(`/api/comments/1`)
          .expect(400)
          .send(updatedVotes);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return a 400 status code and an error message when the given comment id is invalid", async () => {
        const updatedVotes = { inc_votes: 10 };
        const response = await request(app)
          .patch("/api/comments/notAnId")
          .expect(400)
          .send(updatedVotes);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return a 404 status code and an error message when the given comment id doesn't exist", async () => {
        const updatedVotes = { inc_votes: 10 };
        const response = await request(app)
          .patch(`/api/comments/1000`)
          .expect(404)
          .send(updatedVotes);
        const { msg } = response.body;
        expect(msg).toBe("Comment does not exist");
      });
    });
    describe("POST: /api/articles/:article_id/comments", () => {
      test("Should successfully post a new comment to the given article id", async () => {
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
        const response = await request(app)
          .post(`/api/articles/3/comments`)
          .send(addedComment)
          .expect(201);
        const { newComment } = response.body;
        expect(newComment.body).toBe(comment.body);
        expect(newComment.comment_id).toBe(19);
        expect(newComment.article_id).toBe(3);
        expect(newComment.author).toBe("lurker");
        expect(newComment).toHaveProperty("created_at");
        expect(newComment).toHaveProperty("votes");
      });
      test("Should successfully post a new comment when it has extra properties", async () => {
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
        const response = await request(app)
          .post(`/api/articles/3/comments`)
          .send(addedComment)
          .expect(201);
        const { newComment } = response.body;
        expect(newComment.body).toBe(comment.body);
        expect(newComment.comment_id).toBe(19);
        expect(newComment.article_id).toBe(3);
        expect(newComment).toHaveProperty("created_at");
        expect(newComment).toHaveProperty("votes");
      });
      test("Should return an error message when the article_id type is invalid", async () => {
        const addedComment = {
          username: "lurker",
          body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
        };
        const response = await request(app)
          .post("/api/articles/notAnId/comments")
          .send(addedComment)
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return an error message when there is no given properties", async () => {
        const addedComment = {};
        const response = await request(app)
          .post(`/api/articles/3/comments`)
          .send(addedComment)
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return an error message when article id does not exist", async () => {
        const addedComment = {
          username: "notValid",
          body: "This should not work",
        };
        const response = await request(app)
          .post(`/api/articles/1000/comments`)
          .send(addedComment)
          .expect(404);
        const { msg } = response.body;
        expect(msg).toBe("Article does not exist");
      });
      test("Should return an error message when article id does not exist", async () => {
        const addedComment = {
          username: "lurker",
          body: "I agree, centering divs are probably the worst ticket to get given as backend dev, I asked my friend to confirm for me.",
        };
        const response = await request(app)
          .post("/api/articles/1000/comments")
          .send(addedComment)
          .expect(404);
        const { msg } = response.body;
        expect(msg).toBe("Article does not exist");
      });
    });
    describe("DELETE: /api/comments/:comment_id", () => {
      test("Should successfully delete the comment with the id given", async () => {
        await request(app).delete(`/api/comments/3`).expect(204);
        const response = await request(app)
          .get("/api/articles/3/comments")
          .expect(200);
        const { articleComments } = response.body;
        expect(articleComments).not.toContainEqual(
          expect.objectContaining({ comment_id: 3 })
        );
      });
      test("Should return a 400 status code and an error message when the comment id is an invalid type", async () => {
        const response = await request(app)
          .delete("/api/comments/notAnId")
          .expect(400);
        const { msg } = response.body;
        expect(msg).toBe("Bad request");
      });
      test("Should return a 404 status code and an error message when the comment id does not exist", async () => {
        const response = await request(app)
          .delete(`/api/comments/9999`)
          .expect(404);
        const { msg } = response.body;
        expect(msg).toBe("Comment does not exist");
      });
    });
  });
});
