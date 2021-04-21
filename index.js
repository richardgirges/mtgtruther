const express = require("express");
const dbPool = require('./dbPool');
const doScrape = require("./doScrape");
const doClearDuplicates = require('./doClearDuplicates');
const app = express();

const port = process.env.PORT || 8080;
const scrapeInterval = 3 * 60 * 60 * 1000;
const clearDupesInterval = 6 * 60 * 60 * 1000;

// we check for new comments every 3 hours
setInterval(doScrape, scrapeInterval);

// clear duplicates every 6 hours
setInterval(doClearDuplicates, clearDupesInterval)

app.get("/", (req, res) => res.send("hello"));

app.get("/ping", (req, res) => res.send("pong"));

app.get("/truth", async (req, res) => {
  const dbClient = await dbPool.connect();

  try {
    const queryRes = await dbClient.query(
      "SELECT * FROM truths WHERE LENGTH(body) > 35 OFFSET floor(random()*(SELECT COUNT(*) FROM truths WHERE LENGTH(body) > 35)) LIMIT 1"
    );
    const selectedRow = queryRes.rows[0];

    if (!selectedRow) {
      return res.send("");
    }

    let comment =
      req.query.mode === "text" ? selectedRow.body : selectedRow.bodyhtml;

    if (req.query.short === "true") {
      comment = comment.slice(0, 250);
    }

    res.send(comment);

    dbClient.release();
  } catch (e) {
    dbClient.release();
    res.status(500).send(e);
  }
});

app.listen(port, () => console.log("listening on port " + port));
