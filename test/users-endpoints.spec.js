const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe("Users Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  context("Given there are data in the database", () => {
    it("GET /api/users responds with 200 and all of the users", () => {
      return supertest(app).get("/api/users").expect(200);
    });

    it("GET /api/shoes responds with 200 and all of the shoes", () => {
      return supertest(app).get("/api/shoes").expect(200);
    });

    it("GET /api/wishlist responds with 200 and all wishlist", () => {
      return supertest(app).get("/api/wishlist").expect(200);
    });
  });
});
