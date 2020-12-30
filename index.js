const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();

const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("hello"));

app.get("/ping", (req, res) => res.send("pong"));

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

app.listen(port, () => console.log("listening on port " + port));
