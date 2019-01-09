const Mocha = require("mocha");
const chai = require("chai");
const {assert} = chai;

const request = require("request");
const wiki = require("../wiki-api/wiki")(request);
const gameBuilder = require("../helpers/game-builder")(wiki);

describe("Article processing", () => {

  // https://en.wikipedia.org/wiki/Desert_Rat_Scrap_Book
  const articleId = 11263477;

  let article;
  before((done) => {
    wiki.getArticleById(articleId)
      .then((result) => {
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

});

describe("Useability\n\t(If these fail, check that each test's article still fits the criteria)", () => {

  async function testUseability(id, expectingArticle) {

    const article = await wiki.getArticleById(id);
    const useable = await gameBuilder.isUseableArticle(article);

    if (expectingArticle) {
      if (!useable || !useable.title) {
        console.log(`\t\tuseability test failed for article ${id}`);
      }
      assert.isOk(useable);
    } else {
      if (useable && useable.title) {
        console.log(`\t\tuseability test failed for article ${id}`);
      }
      assert.isNotOk(useable);
    }

  }

  it("should return false for an article with no links", async () => {

    // https://en.wikipedia.org/wiki/Special:DeadendPages
    // https://en.wikipedia.org/wiki/Child_bereavement (no links as of Dec. 2018)
    await testUseability(55307463, false);

  });

  it("should return false for an article with no links to it", async () => {

    // https://en.wikipedia.org/wiki/Category:Orphaned_articles
    // Ronan Carroll (no links to it as of Dec. 2018)
    await testUseability(31940707, false);

  });

  it("should return false for an article with no categories", async () => {

    // University of Mendoza
    await testUseability(27342618, false);

  });

  it("should return the article for an article with links, links to it, and categories", async () => {

    // Basketball
    testUseability(3921, true);

  });

});

describe("Duplicate filtering\n\t(If these fail, check that each test's article still fits the criteria)", () => {

  // 4180746 - Victoria Golf Club - Only has six links (Jan. 2019)
  it("should not return duplicate destinations", async () => {

    const article = await wiki.getArticleById(4180746);
    const destinations = await gameBuilder.addDestinations(article);

    // console.log(destinations);

    const duplicates = destinations.some((dest, idx) => {
      const first = destinations.findIndex((e) => e.title === dest.title);
      return first !== idx;
    });

    // console.log(duplicates);

    assert.isFalse(duplicates);
  });

});

describe("Generating a game", () => {

  let game = {};
  before(function (done) {
    this.timeout(20000); // Keep Mocha from complaining at how long this takes
    gameBuilder.logGame = true; // Spit out progress
    gameBuilder.generateGame()
      .then((result) => {
        game = result;
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
