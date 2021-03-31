const dbPool = require("./dbPool");

module.exports = async function doClearDuplicates() {
  const dbClient = await dbPool.connect();

  try {
    console.log("Clearing duplicates...");
    const res = await dbClient.query(
      "DELETE FROM truths a USING truths b WHERE a.id < b.id AND a.body = b.body"
    );
    console.log(`${res.rowCount} duplicates cleared.`);
  } catch (e) {
    dbClient.release();
    console.error("DB error while clearing duplicates", e);
    process.exit(-1);
  }
};
