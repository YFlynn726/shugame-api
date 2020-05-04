//const path = require("path");
const express = require("express");
const xss = require("xss");
const ShoesService = require("./shoes-service");

const shoesRouter = express.Router();
const jsonParser = express.json();

const serializeShoe = (shoe) => ({
  id: shoe.id,
  name: xss(shoe.name),
  shoe_size: xss(shoe.shoe_size),
  usage: xss(shoe.usage),
  user_id: shoe.user_id,
  order_link: xss(shoe.order_link),
});

shoesRouter
  .route("/api/shoes")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    ShoesService.getAllShoes(knexInstance)
      .then((shoes) => {
        res.json(shoes.map(serializeShoe));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, shoe_size, user_id, usage, order_link } = req.body;
    const newShoe = { name, shoe_size, user_id, usage, order_link };

    for (const [key, value] of Object.entries(newShoe)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    ShoesService.insertShoe(req.app.get("db"), newShoe)
      .then((shoe) => {
        res.status(201).location(`/shoes/${shoe.id}`).json(serializeShoe(shoe));
      })
      .catch(next);
  });

shoesRouter
  .route("/:shoe_id")
  .all((req, res, next) => {
    ShoesService.getById(req.app.get("db"), req.params.shoe_id)
      .then((shoe) => {
        if (!shoe) {
          return res.status(404).json({
            error: { message: `shoe doesn't exist` },
          });
        }
        res.shoe = shoe;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeShoe(res.shoe));
  })
  .delete((req, res, next) => {
    ShoesService.deleteShoe(req.app.get("db"), req.params.shoe_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, shoe_size, usage, order_link } = req.body;
    const shoeToUpdate = { name, shoe_size, usage, order_link };

    const numberOfValues = Object.values(shoeToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name', 'shoe size', 'usage' or 'order link'`,
        },
      });

    ShoesService.updateShoe(req.app.get("db"), req.params.shoe_id, shoeToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = shoesRouter;
