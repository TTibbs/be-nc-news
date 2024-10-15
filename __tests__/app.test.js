const app = require("../db/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

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
        const articlesSortedByDate = articles.sort((a, b) =>
          a.created_at.localeCompare(b.created_at)
        );
        expect(articlesSortedByDate).toEqual(articles);
        articles.forEach((article) => {
          expect(article).not.toContain(article.body);
          expect(typeof article.comment_count).toBe("string");
          expect(typeof article.created_at).toBe("string");
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
