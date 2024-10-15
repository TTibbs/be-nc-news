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
        expect(typeof body.article.title).toBe("string");
        expect(body.article.title).toBe("Living in the shadow of a great man");
        expect(typeof body.article.topic).toBe("string");
        expect(body.article.topic).toBe("mitch");
        expect(typeof body.article.author).toBe("string");
        expect(body.article.author).toBe("butter_bridge");
        expect(typeof body.article.body).toBe("string");
        expect(body.article.body).toBe("I find this existence challenging");
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.votes).toBe("number");
        expect(body.article.votes).toBe(100);
        expect(typeof body.article.article_img_url).toBe("string");
        expect(body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
  });
  test("Should return the details for article 2 as that is the endpoint being navigated to", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        expect(body.article.article_id).toBe(2);
        expect(typeof body.article.title).toBe("string");
        expect(body.article.title).toBe("Sony Vaio; or, The Laptop");
        expect(typeof body.article.topic).toBe("string");
        expect(body.article.topic).toBe("mitch");
        expect(typeof body.article.author).toBe("string");
        expect(body.article.author).toBe("icellusedkars");
        expect(typeof body.article.body).toBe("string");
        expect(body.article.body).toBe("Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.");
        expect(typeof body.article.created_at).toBe("string");
        expect(typeof body.article.article_img_url).toBe("string");
        expect(body.article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
      });
  });
  describe("GET: 404 /api/articles/:article_id", () => {
    test("Should return a message saying the article id does not exist", () => {
      return request(app)
        .get("/api/articles/1000")
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
