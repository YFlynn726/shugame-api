const WishService = {
  getAllWish(knex) {
    return knex.select("*").from("wishlist");
  },

  insertWish(knex, newWish) {
    return knex
      .insert(newWish)
      .into("wishlist")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteWish(knex, id) {
    return knex("wishlist").where({ id }).delete();
  },

  getById(knex, id) {
    return knex.from("wishlist").select("*").where("id", id).first();
  },

  updateWish(knex, id, newWishFields) {
    return knex("wishlist").where({ id }).update(newWishFields);
  },
};

module.exports = WishService;
