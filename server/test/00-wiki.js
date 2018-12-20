const Mocha = require("mocha");
const {assert} = require("chai");

const request = require("request");
const wiki = require("../wiki-api/wiki")(request);

// Using this for our test queries:
// https://en.wikipedia.org/wiki/Desert_Rat_Scrap_Book
const articleId = 11263477;

xdescribe("Wikipedia Queries", () => {

  it("should return a random Wikipedia article in JSON form", (done) => {

    wiki.getRandomArticleId()
      .then((data) => {
        done();
      });

  });

});
