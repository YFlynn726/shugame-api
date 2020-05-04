module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://dunder_mifflin@localhost:5432/shugame_api",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgres://dunder_mifflin@localhost:5432/shugame_api_test",
};
