const Mocha = require("mocha");
const {assert} = require("chai");

const queries = require("../wiki-api/wiki");

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
    queries.getArticleById(articleId)
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

    it("should return a random category that the page belongs to", () => {
      const rand = queries.getRandomCategory(article);
      assert.exists(article.categories.some((cat) => cat === rand));
    });
  });

  describe("Useability\n(If any of these fail, double-check that the test article still fits the criteria)", () => {

    async function testUseability(id, expectingArticle) {

      const article = await queries.getArticleById(id);
      const useable = await queries.isUseableArticle(article);

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

  // xdescribe("Parsing WikiText", () => {

  //   it("should have the parsed WikiText for an articleId", (done) => {
  //     assert.exists(article.wikitext);
  //     assert.match(article.wikitext, /^\{\{/);
  //     done();
  //   });

  //   xit("should count how many times each linked article is mentioned in the WikiText", () => {
  //     assert.isTrue(false);
  //   });

  // });

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

describe("Generating a mystery", () => {

  // Get a mystery
  let mystery = {};
  before((done) => {
    queries.generateMystery()
      .then((result) => {
        mystery = result;
        // print("Mystery:", mystery);
        done();
      });
  });

  it("should exist", () => {
    assert.isOk(mystery);
  });

  it("should have a suspect", () => {
    assert.isOk(mystery.suspect);
  });

  it("should contain destinations for each step but the last", () => {
    const destSteps = mystery.steps.slice(0, -1);

    assert.isTrue(
      destSteps.every((step) => step.destinations && step.destinations.length)
    );

  });

  it("should contain clues for each step but the last", () => {
    const clueSteps = mystery.steps.slice(0, -1);

    assert.isTrue(
      clueSteps.every((step) => step.clues && step.clues.length)
    );

  });

});


function print(heading, query) {
  console.log("\n" + heading + "\n" + JSON.stringify(query, null, 2));
}
