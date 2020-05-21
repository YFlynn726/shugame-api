const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");

describe("Endpoints", function () {
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

    it("POST /api/users responds with 201", () => {
      newUser = {
        first_name: "John",
        last_name: "Bob",
      };
      return supertest(app).post("/api/users").send(newUser).expect(201);
    });

    it("GET /api/shoes responds with 200 and all of the shoes", () => {
      return supertest(app).get("/api/shoes").expect(200);
    });

    it("POST /api/shoes responds with 201", () => {
      newShoes = {
        name: "Boosters",
        shoe_size: 6,
        usage: 8,
        user_id: 3,
        order_link: "https://www.amazon.com",
      };
      return supertest(app).post("/api/shoes").send(newShoes).expect(201);
    });

    it("GET /api/wishlist responds with 200 and all wishlist", () => {
      return supertest(app).get("/api/wishlist").expect(200);
    });

    it("POST /api/wishlist responds with 201", () => {
      newWish = {
        name: "Boosters3",
        user_id: 3,
        order_link: "https://www.amazon.com",
      };
      return supertest(app).post("/api/wishlist").send(newWish).expect(201);
    });
  });
});

describe(`GET /api/users/:user_id`, () => {
  it(`responds with 200`, () => {
    const userId = 1;
    return supertest(app).get(`/api/users/${userId}`).expect(200);
  });
});

describe(`GET /api/shoes/:shoe_id`, () => {
  it(`responds with 200`, () => {
    const shoeId = 6;
    return supertest(app).get(`/api/shoes/${shoeId}`).expect(200);
  });

  it("PATCH /api/shoes/:shoe_id responds with 201", () => {
    const shoeId = 6;

    newUpdate = {
      usage: 8,
    };
    return supertest(app)
      .patch(`/api/shoes/${shoeId}`)
      .send(newUpdate)
      .expect(201);
  });

  it("DELETE /api/shoes/:shoe_id responds with 204", () => {
    const shoeId = 6;

    return supertest(app).delete(`/api/shoes/${shoeId}`).expect(204);
  });
});

describe(`GET /api/wishlist/:wishlist_id`, () => {
  it(`responds with 200`, () => {
    const wishlistId = 1;
    return supertest(app).get(`/api/wishlist/${wishlistId}`).expect(200);
  });
});
