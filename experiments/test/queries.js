const Mocha = require("mocha");
const {assert} = require("chai");

const queries = require("../queries");

// Using this for our test queries:
// https://en.wikipedia.org/wiki/Desert_Rat_Scrap_Book
const articleId = 11263477;

describe("Basic Queries", () => {

  it("should return a random Wikipedia article in JSON form", (done) => {

    queries.getRandomArticleId()
      .then((data) => {
        // print("random wikipedia article", data);
        done();
      });

  });

});

describe("Article processing", () => {

  let article;
  before((done) => {
    queries.getArticle(articleId)
      .then((result) => {

        // print("Article data:", result);
        article = result;

        done();
      });
  });

  describe("Metadata", () => {
    it("should have a URL to the article", () => {
      assert.exists(article.fullurl);
    });

    it("should have a list of links that direct to that article", () => {
      assert.exists(article.linkshere);
    });

    it("should have a list of categories that the article belongs to", () => {
      assert.exists(article.categories);
    });

    it("should have a list of pages that the article links to", () => {
      assert.exists(article.links);
    });

  });

  describe("Random functions", () => {

    it("should return a random article link found on a given page", () => {
      const rand = queries.getRandomLinkFrom(article);
      assert.exists(article.links.some((link) => link === rand));
    });

    it("should return a random article that links to a given page", () => {
      const rand = queries.getRandomLinkTo(article);
      assert.exists(article.linkshere.some((link) => link === rand));
    });
  });

  describe("Parsing WikiText", () => {

    it("should have the parsed WikiText for an articleId", (done) => {
      assert.exists(article.wikitext);
      assert.match(article.wikitext, /^\{\{/);
      done();
    });

    xit("should count how many times each linked article is mentioned in the WikiText", () => {
      assert.isTrue(false);
    });

  });

});



xdescribe("Pick a villain (The Culprit)", () => {

  it("Should return a random villain", (done) => {

  });

  // Generating a villain should return a list of clues pertaining to them,
  // which will be randomly given in place of article clues
});

xdescribe("At each subsequent step...", () => {

  // Call a master "generate step" function that picks a random article from
  // a given articleId's links

  // The returned data should include the article (title/id, url?) and up to
  // three clues pertaining to it

  // A full game

});



function print(heading, query) {
  console.log("\n" + heading + "\n" + JSON.stringify(query, null, 2));
}
