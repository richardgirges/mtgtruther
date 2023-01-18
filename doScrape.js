const fetch = require("node-fetch");
const cheerio = require("cheerio");
const dbPool = require("./dbPool");
const pgFormat = require("pg-format");

module.exports = async function doScrape() {
  const dbClient = await dbPool.connect();

  try {
    const queryRes = await dbClient.query(
      "SELECT * FROM truths ORDER BY id DESC LIMIT 1"
    );
    const lastSyncedPage = queryRes.rows[0] ? queryRes.rows[0].page : 0;
    const nextSyncedPage = lastSyncedPage + 1;

    console.log(
      `Last synced page is ${lastSyncedPage}. Moving onto ${nextSyncedPage}...`
    );

    const body = await fetch(
      "https://feedback.wizards.com/forums/918667-mtg-arena-bugs-product-suggestions/suggestions/44184111-algorithm-improvement?page=" +
        nextSyncedPage
    ).then((res) => res.text());

    const $ = cheerio.load(body);
    const scrapedComments = [];

    $(".uvListItem .uvUserActionBody .typeset").each((index, el) => {
      scrapedComments.push([$(el).text(), $(el).html(), nextSyncedPage]);
    });

    if (!scrapedComments.length) {
      console.log("No new comments found.");
    } else {
      await dbClient.query(
        pgFormat(
          "INSERT INTO truths (body, bodyhtml, page) VALUES %L",
          scrapedComments
        )
      );
      console.log(`Done importing page ${nextSyncedPage}.`);
    }

    dbClient.release();
  } catch (e) {
    dbClient.release();
    console.error("DB error", e);
    process.exit(-1);
  }
};
