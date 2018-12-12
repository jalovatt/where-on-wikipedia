const Mocha = require("mocha");
const {assert} = require("chai");

const queries = require("../queries");

describe("Basic Queries", () => {

  it("should return a random Wikipedia article in JSON form", (done) => {

    queries.getRandomArticle()
      .then((data) => {
        assert.exists(data.query.random[0]);
        done();
      });

  });

});

describe("Article metadata", () => {

  let articleId;
  before((done) => {
    queries.getRandomArticle()
      .then((data) => {
        articleId = data.query.random[0].id;
        done();
      });
  });

  it("should return a URL to the article", (done) => {
    queries.getArticleUrl(articleId)
      .then((data) => {
        // assert.exists
        console.log(data);
        done();
      });
  });

  it("should return the list of links that direct to that article", (done) => {
    queries.getLinksHere(articleId)
      .then((data) => {
        assert.exists(data.query.pages[articleId].linkshere);
        done();
      });
  });

  it("should return the list of categories that the article belongs to", (done) => {
    queries.getCategories(articleId)
      .then((data) => {
        assert.exists(data.query.pages[articleId].categories);
        done();
      });
  });

  it("should return a list of pages that the article links to", (done) => {
    queries.getLinksTo(articleId)
      .then((data) => {
        assert.exists(data.query.pages[articleId].links);
        done();
      });
  });

});

describe("Processing WikiText", () => {
  it("should get the parsed WikiText for an articleId", (done) => {
    queries.getWikiText(18702834)
      .then((data) => {
        assert.exists(data.parse.wikitext["*"]);
        assert.match(data.parse.wikitext["*"], /^\{\{/);
        done();
      });
  });

  xit("should count how many times each linked article is mentioned in the WikiText", () => {

  });

});

xdescribe("Pick a villain (The Culprit)", () => {

  it("Should return a random villain", (done) => {

  });

  it("Should return a list of pages that link to the villain", (done) => {

  });

  it("Should return a list of pages that the villain links to", (done) => {

  });

});

xdescribe("At each subsequent step...", () => {

});
