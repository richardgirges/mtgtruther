const { Pool } = require("pg");
const dbPool = new Pool({ connectionString: process.env.DATABASE_URL });

dbPool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports = dbPool;
