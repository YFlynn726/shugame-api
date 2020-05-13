const { expect } = require("chai");
const supertest = require("supertest");
const knex = require("knex");

const app = require("../src/app");

describe("App", () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app).get("/").expect(200, "Hello, world!");
  });
});

// describe.only("GET /api/users", () => {
//   it("should return an array of users", () => {
//     return supertest(app)
//       .get("/api/users")
//       .expect(200)
//       .expect("Content-Type", /json/);
//   });
// });

// describe("GET /api/shoes", () => {
//   it(`responds with 200 with a list`, () => {
//     return supertest(app).get("/api/shoes").expect(200, []);
//   });
//});
