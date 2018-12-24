const request = require("request");
const wiki = require("../server/wiki-api/wiki.js")(request);

const base = "https://en.wikipedia.org/w/api.php?action=query&format=json&action=query&titles=";

const bad = [
  "2007–08 Washington Wizards season",
  "2002–03 Indiana Pacers season",
  "Coat of arms of Bacău",
];

const good = [
  "Villa Pisani, Bagnolo",
];

wiki.getArticleIdFromTitle(bad[0]);
