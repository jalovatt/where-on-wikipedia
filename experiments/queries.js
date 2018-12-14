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

  getArticleIdFromTitle(title) {
    const params = {
      titles: title
    };

    return wikiQuery(params)
      .then((data) => Object.values(data.query.pages)[0].pageid);

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

  getArticleById: async function getArticleById(articleId) {

    console.log("getArticleById: " + articleId);

    const data = await this.getArticleData(articleId);
    const text = await this.getArticleWikiText(articleId);
    text.wikitext = text.wikitext["*"];

    return {...data, ...text};

  },

  getArticleByTitle: async function getArticleByTitle(articleTitle) {

    const articleId = await this.getArticleIdFromTitle(articleTitle);
    return this.getArticleById(articleId);

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

  isUseableArticle(article) {
    // console.log("=================");
    // console.log("IS USEABLE ARTICLE GOT:");
    // console.log(JSON.stringify(article, null, 2));
    // console.log("=================");
    return (
      article.links &&
      article.links.length &&
      article.linkshere &&
      article.linkshere.length &&
      article.categories &&
      article.categories.length
    ) && article;
  },

  findUseableLinkFrom: async function findUseableLinkFrom(article) {

    let useable = false;

    do {
      const curLink = this.getRandomLinkFrom(article).title;

      const curId = await this.getArticleIdFromTitle(curLink);
      console.log(JSON.stringify(curId));

      if (!curId || curId === "0") continue;

      const curArticle = await this.getArticleById(curId);

      useable = this.isUseableArticle(curArticle);

    } while (!useable);

    return useable;

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
      ((randomInt(2) === 1) ? this.generateArticleClue(article, suspect) : this.generateSuspectClue(suspect))
    );

    return clues;

  },

  generateNextStep: async function generateNextStep(prevArticle, final) {

    const nextLink = await this.findUseableLinkFrom(prevArticle);

    console.log("\tnext article: " + nextLink.title);

    const step = {};
    step.article = await this.getArticleByTitle(nextLink.title);

    step.clues = (final)
      ? ["You caught up to the thief!!"]
      : this.generateClues(step.article);

    return step;

  },

  generateMystery: async function generateMystery(numSteps = 5) {

    console.log("====================");
    console.log("generating a mystery");

    const lootId = await this.getRandomArticleId();
    const loot = await this.getArticleById(lootId);

    let prevArticle = loot;
    let nextId;

    const steps = {};
    for (let i = 1; i <= numSteps; i++) {

      console.log("\tgenerating " + i);

      const step = await this.generateNextStep(prevArticle, (i === numSteps));
      steps[step.article.pageid] = {...step};

      prevArticle = step.article;

    }

    console.log("finished the mystery");
    console.log("====================");

    return steps;

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
