const Mocha = require("mocha");
const {assert} = require("chai");

const request = require("request");
const wiki = require("../wiki-api/wiki")(request);
const gameBuilder = require("../helpers/game-builder")(wiki);

// Using this for our test queries:
// https://en.wikipedia.org/wiki/Desert_Rat_Scrap_Book
const articleId = 11263477;

describe("Article processing", () => {

  let article;
  before((done) => {
    wiki.getArticleById(articleId)
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
      const rand = gameBuilder.getRandomLinkFrom(article);
      assert.exists(article.links.some((link) => link === rand));
    });

    it("should return a random article that links to a given page", () => {
      const rand = gameBuilder.getRandomLinkTo(article);
      assert.exists(article.linkshere.some((link) => link === rand));
    });

    it("should return a random category that the page belongs to", () => {
      const rand = gameBuilder.getRandomCategory(article);
      assert.exists(article.categories.some((cat) => cat === rand));
    });
  });

  describe("Useability\n\t(If these fail, check that each test's article still fits the criteria)", () => {

    async function testUseability(id, expectingArticle) {

      const article = await wiki.getArticleById(id);
      const useable = await gameBuilder.isUseableArticle(article);

      if (expectingArticle) {
        assert.isOk(useable);
      } else {
        assert.isNotOk(useable);
      }

    }

    it("should return false for an article with no links", async () => {

      // https://en.wikipedia.org/wiki/Special:DeadendPages
      // Robert Dotson (no links as of Dec. 2018)
      testUseability(50059391, false);

    });

    it("should return false for an article with no links to it", async () => {

      // https://en.wikipedia.org/wiki/Category:Orphaned_articles
      // Ronan Carroll (no links to it as of Dec. 2018)
      testUseability(31940707, false);

    });

    it("should return false for an article with no categories", async () => {

      // University of Mendoza
      testUseability(27342618, false);

    });

    it("should return the article for an article with links, links to it, and categories", async () => {

      // Jenner Township, Somerset County, Pennsylvania
      testUseability(133795, true);

    });

  });

  xdescribe("Pick a suspect", () => {

    it("Should return a random suspect", (done) => {

    });

    // Generating a suspect should return a list of clues pertaining to them,
    // which will be randomly given in place of article clues
  });

  // xdescribe("Generating clues", () => {

  //   let clues;
  //   before((done) => {
  //     clues = queries.addClues(article);
  //     print("Clues:", clues);
  //     done();
  //   });

  //   it("should have three clues", () => {
  //     assert.equal(clues.length, 3);
  //   });

  // });

});

describe("Generating a game", () => {

  // Get a mystery
  let game = {};
  before(function (done) {
    this.timeout(20000);
    gameBuilder.logMystery = true; // Spit out progress
    gameBuilder.generateGame()
      .then((result) => {
        game = result;
        // print("Mystery:", mystery);
        done();
      });
  });

  it("should exist", () => {
    assert.isOk(game);
  });

  it("should have an ID", () => {
    assert.exists(game["_id"]);
  });

  it("should have a suspect", () => {
    assert.isOk(game.suspect);
  });

  it("should contain destinations for each step but the last", () => {
    const destSteps = game.steps.slice(0, -1);

    assert.isTrue(
      destSteps.every((step) => step.destinations && step.destinations.length)
    );

  });

  it("should contain clues for each step but the last", () => {
    const clueSteps = game.steps.slice(0, -1);

    assert.isTrue(
      clueSteps.every((step) => step.clues && step.clues.length)
    );

  });

});


function print(heading, query) {
  console.log("\n" + heading + "\n" + JSON.stringify(query, null, 2));
}
