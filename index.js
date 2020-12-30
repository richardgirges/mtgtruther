const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();

app.get("/truth", (req, res) => {
  request(
    {
      uri:
        "https://feedback.wizards.com/forums/918667-mtg-arena-bugs-product-suggestions/suggestions/41537692-shuffler-algoritm",
    },
    function (error, response, body) {
      const comments = [];
      const $ = cheerio.load(body);
      $(".uvListItem .uvUserActionBody .typeset").each((index, el) => {
        comments.push($(el).html());
      });

      res.send(comments[Math.floor(Math.random() * comments.length)]);
    }
  );
});

app.listen(8000, () => console.log("listening on port 8000"));
