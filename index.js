const express = require("express");
const request = require("request");
const cheerio = require("cheerio");
const app = express();

const port = process.env.PORT || 8080;

app.get("/", (req, res) => res.send("hello"));

app.get("/ping", (req, res) => res.send("pong"));

app.get("/truth", (req, res) => {
  const randomPage = Math.floor(Math.random() * 75) + 1;
  request(
    {
      uri:
        "https://feedback.wizards.com/forums/918667-mtg-arena-bugs-product-suggestions/suggestions/41537692-shuffler-algoritm?page=" + randomPage,
    },
    function (error, response, body) {
      const comments = [];
      const $ = cheerio.load(body);
      $(".uvListItem .uvUserActionBody .typeset").each((index, el) => {
        comments.push($(el).text());
      });

      res.send(comments[Math.floor(Math.random() * comments.length)]);
    }
  );
});

app.listen(port, () => console.log("listening on port " + port));
