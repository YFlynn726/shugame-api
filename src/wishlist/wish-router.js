//const path = require("path");
const express = require("express");
const xss = require("xss");
const WishService = require("./wish-service");

const wishRouter = express.Router();
const jsonParser = express.json();

const serializeWish = (wishlist) => ({
  id: wishlist.id,
  name: xss(wishlist.name),
  user_id: wishlist.user_id,
  order_link: xss(wishlist.order_link),
});

wishRouter
  .route("/api/wishlist")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    WishService.getAllWish(knexInstance)
      .then((wishlist) => {
        res.json(wishlist.map(serializeWish));
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { name, user_id, order_link } = req.body;
    const newWish = { name, user_id, order_link };

    for (const [key, value] of Object.entries(newWish)) {
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });
      }
    }

    WishService.insertWish(req.app.get("db"), newWish)
      .then((wishlist) => {
        res
          .status(201)
          .location(`/wishlist/${wishlist.id}`)
          .json(serializeWish(wishlist));
      })
      .catch(next);
  });

wishRouter
  .route("/:wishlist_id")
  .all((req, res, next) => {
    WishService.getById(req.app.get("db"), req.params.wishlist_id)
      .then((wishlist) => {
        if (!wishlist) {
          return res.status(404).json({
            error: { message: `Wishlist item doesn't exist` },
          });
        }
        res.wishlist = wishlist;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeWish(res.wishlist));
  })
  .delete((req, res, next) => {
    WishService.deleteWish(req.app.get("db"), req.params.wishlist_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { name, order_link } = req.body;
    const wishToUpdate = { name, order_link };

    const numberOfValues = Object.values(wishToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'name' or 'order link'`,
        },
      });

    WishService.updateWish(
      req.app.get("db"),
      req.params.wishlist_id,
      wishToUpdate
    )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = wishRouter;
