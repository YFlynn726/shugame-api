require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const usersRouter = require("./users/users-router");
const shoesRouter = require("./shoes/shoes-router");
const wishRouter = require("./wishlist/wish-router");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use("/api/users", usersRouter);
app.use("/api/shoes", shoesRouter);
app.use("/api/wishlist", wishRouter);

app.get("/api/users", usersRouter);
app.post("/api/users", usersRouter);
app.get("/api/users/:user_id", usersRouter);

app.get("/api/shoes", shoesRouter);
app.post("/api/shoes", shoesRouter);
app.get("/api/shoes/:shoe_id", shoesRouter);

app.get("/api/wishlist", wishRouter);
app.post("/api/wishlist", wishRouter);
app.get("/api/wishlist/:wishlist_id", wishRouter);

// app.get("/api/users", (req, res, next) => {
//   const knexInstance = req.app.get("db");
//   UsersService.getAllUsers(knexInstance)
//     .then((users) => {
//       res.json(users);
//     })
//     .catch(next);
// });

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
