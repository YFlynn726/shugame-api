const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe.only("Users Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("users").truncate());
  afterEach("cleanup", () => db("users").truncate());

  context("Given there are articles in the database", () => {
    const testUsers = [
      {
        id: 1,
        first_name: "Larry",
        last_name: "Bird",
      },
      {
        id: 2,
        first_name: "Mike",
        last_name: "Tyson",
      },
    ];

    beforeEach("insert users", () => {
      return db.into("users").insert(testUsers);
    });

    it("GET /api/users responds with 200 and all of the users", () => {
      return supertest(app).get("/api/users").expect(200, testUsers);
    });
  });
});
