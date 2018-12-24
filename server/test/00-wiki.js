const Mocha = require("mocha");
const {assert} = require("chai");

const request = require("request");
const wiki = require("../wiki-api/wiki")(request);

// Using this for our test queries:
// https://en.wikipedia.org/wiki/Desert_Rat_Scrap_Book
const articleId = 11263477;

describe("Wikipedia Queries", () => {

  it("should return a random Wikipedia article ID", async () => {

    const id = await wiki.getRandomArticleId();
    assert.isOk(parseInt(id));
  });

  it("should safely handle titles that aren't URL-safe", async () => {
    assert.isOk(await wiki.getArticleIdFromTitle("2007–08 Washington Wizards season"));
    assert.isOk(await wiki.getArticleIdFromTitle("2002–03 Indiana Pacers season"));
    assert.isOk(await wiki.getArticleIdFromTitle("Coat of arms of Bacău"));
  });

});
