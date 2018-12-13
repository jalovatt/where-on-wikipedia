const request = require("request");

const apiURL = "https://en.wikipedia.org/w/api.php?action=query";


// 11263477
// Desert Rat Scrap Book



module.exports = {

  getRandomArticleId() {
    const params = {
      list: "random",
      rnnamespace: 0,
      rnlimit: 1
    };

    return wikiQuery(params).then((data) => data.query.random[0].id);
  },

  getArticleData(articleId) {
    const params = {
      action: "query",
      format: "json",
      prop: "links|linkshere|categories|info",
      pageids: articleId,
      plnamespace: "0",
      pllimit: "100",
      pldir: "ascending",
      lhprop: "pageid|title",
      lhnamespace: "0",
      lhshow: "!redirect",
      lhlimit: "100",
      clshow: "!hidden",
      cllimit: "50",
      inprop: "url"
    };

    return wikiQuery(params)
      .then((data) => data.query.pages[articleId]);

  },

  getArticleWikiText(articleId) {
    ///w/api.php?action=parse&format=json&pageid=18702834&prop=categories%7Clinks%7Cimages%7Csections%7Cdisplaytitle%7Ciwlinks%7Cproperties%7Cwikitext
    const params = {
      action: "parse",
      pageid: articleId,
      prop: "images|sections|displaytitle|wikitext"
    };

    return wikiQuery(params)
      .then((data) => data.parse);
  },

  getArticle(articleId) {

    return Promise.all([
      this.getArticleData(articleId),
      this.getArticleWikiText(articleId)
    ]).then((results) => {
      const out ={...results[0], ...results[1]};
      out.wikitext = out.wikitext["*"];
      return out;
    });

  },

  getRandomLinkFrom(article) {
    return article.links[randomInt(article.links.length)];
  },

  getRandomLinkTo(article) {
    return article.linkshere[randomInt(article.linkshere.length)];
  },

  getRandomCategory(article) {
    return article.categories[randomInt(article.categories.length)];
  },


  generateArticleClue(article, suspect) {

    const clueTypes = [

      // - Article that links here
      function(article, suspect) {
        const str = "The suspect asked for directions to an article mentioned in '%ARTICLE%'";

        const rand = randomInt(article.linkshere.length);

        return str.replace("%ARTICLE%", article.linkshere[rand].title);
      },

      // - Category that this belongs to
      function(article, suspect) {
        const str = "The suspect expressed an interest in '%CATEGORY%'";
        const rand = randomInt(article.categories.length);
        return str.replace("%CATEGORY%", article.categories[rand].title);
      },
    ];

    return clueTypes[randomInt(clueTypes.length)](article, suspect);



  },

  generateSuspectClue(suspect) {
    return "a suspect clue";
  },

  generateClues(article, suspect) {

    const clues = [];
    clues.push(
      this.generateArticleClue(article, suspect),
      this.generateArticleClue(article, suspect),
      this.generateArticleClue(article, suspect),
      this.generateArticleClue(article, suspect),
      ((randomInt(2) === 1) ? this.generateArticleClue(article, suspect) : this.generateSuspectClue(suspect))
    );

    return clues;

  }
};

// Adapted from
// https://github.com/jtessler/studio-wiki-race/blob/master/src/WikiApi.js
function wikiQuery(queryParams) {

  const params = [apiURL, "&format=json"];

  if (!queryParams.action) params.push("&action=query");

  Object.keys(queryParams).forEach((param) => {
    params.push(`&${param}=${queryParams[param]}`);
  });

  const query = params.join("");

  return new Promise((resolve, reject) => {
    request(query,
      ((err, res, body) => {
        (err) ? reject(err) : resolve(JSON.parse(body));
      })
    );
  });
}

function randomInt(n) {
  return Math.floor(Math.random() * n);
}
