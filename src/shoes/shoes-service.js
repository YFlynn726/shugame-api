const ShoesService = {
  getAllShoes(knex) {
    return knex.select("*").from("shoes");
  },

  insertShoe(knex, newShoe) {
    return knex
      .insert(newShoe)
      .into("shoes")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  deleteShoe(knex, id) {
    return knex("shoes").where({ id }).delete();
  },

  getById(knex, id) {
    return knex.from("shoes").select("*").where("id", id).first();
  },

  updateShoe(knex, id, newShoeFields) {
    return knex("shoes").where({ id }).update(newShoeFields);
  },
};

module.exports = ShoesService;
