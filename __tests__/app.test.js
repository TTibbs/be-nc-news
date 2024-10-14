const app = require("../db/app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET: /api/topics", () => {
  test("GET: 200 - returns an array of objects containing slug and description properties", () => {
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
        expect(body.endpoints).toEqual(endpoints);
        expect(typeof body.endpoints).toBe("object");
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  test("GET: 200 - returns an article based on the article_id given by user", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article_id.article_id).toBe(1);
        expect(typeof body.article_id.title).toBe("string");
        expect(typeof body.article_id.topic).toBe("string");
        expect(typeof body.article_id.author).toBe("string");
        expect(typeof body.article_id.body).toBe("string");
        expect(typeof body.article_id.created_at).toBe("string");
        expect(typeof body.article_id.votes).toBe("number");
        expect(typeof body.article_id.article_img_url).toBe("string");
      });
  });
  test("GET: 404 - returns a message letting the user know the article id does not exist", () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article does not exist");
      });
  });
});
