const request = require("request");

const apiURL = "https://en.wikipedia.org/w/api.php?action=query";


// 11263477
// Desert Rat Scrap Book

const suspects = [
  99217,    // Ernst Blofeld
  951124,   // Auric Goldfinger
  10656254, // Carmen Sandiego
  300331,   // Irene Adler
  84764,    // Professor Moriarty
  341087,   // Bender
  9533027,  // Lupin III
  1234711,  // Boris Badenov
  1788896,  // Natasha Fatale
  2124741,  // The Grinch
  165684,   // Hannibal Lecter
  882532,   // Alex DeLarge
  441588,   // Maleficent
  98301,    // The Joker
  1547531,  // Cruella de Vil
];



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

    const data = await this.getArticleData(articleId);
    // const text = await this.getArticleWikiText(articleId);

    if (!articleId) return 1 / 0;

    // text.wikitext = text.wikitext["*"];

    // return {...data, ...text};

    return data;

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

    // console.log("finding useable link from article: " + article.title);

    let useable = false;

    do {

      const curLink = this.getRandomLinkFrom(article).title;

      const curId = await this.getArticleIdFromTitle(curLink);

      if (!curId || curId === "0") continue;

      const curArticle = await this.getArticleById(curId);

      useable = this.isUseableArticle(curArticle);

    } while (!useable);

    return useable;

  },

  generateArticleClue(article) {

    const clueTypes = [

      // - Article that links here
      function(article) {
        const str = "The suspect asked for directions to an article mentioned in '%ARTICLE%'";
        const rand = randomInt(article.linkshere.length);

        return str.replace("%ARTICLE%", article.linkshere[rand].title);
      },

      // - Category that this belongs to
      function(article) {
        const str = "The suspect expressed an interest in '%CATEGORY%'";
        const rand = randomInt(article.categories.length);
        return str.replace("%CATEGORY%", article.categories[rand].title);
      },
    ];

    return clueTypes[randomInt(clueTypes.length)](article);

  },

  generateSuspectClue(suspect) {
    return this.generateArticleClue(suspect);
  },

  addClues(article, suspect) {

    const clues = [];
    clues.push(
      this.generateArticleClue(article),
      this.generateArticleClue(article),
      this.generateArticleClue(article),
      ((randomInt(2) === 1) ? this.generateArticleClue(article) : this.generateSuspectClue(suspect)),
      ((randomInt(2) === 1) ? this.generateArticleClue(article) : this.generateSuspectClue(suspect))
    );

    return clues;

  },

  getRandomLinksFrom(article, n) {

    const out = [];
    const l = article.links.length;

    for (let i = 0; i < n; i++) {
      out.push(article.links[randomInt(l)].title);
    }

    return out;
  },

  getDestinations(article, include) {

    const out = this.getRandomLinksFrom(article, 4);
    out.push(include);

    return out;

  },

  generateNextStep: async function generateNextStep(prevArticle, suspect) {

    const nextLink = await this.findUseableLinkFrom(prevArticle);

    const step = {};
    step.article = await this.getArticleByTitle(nextLink.title);

    step.clues = this.addClues(step.article, suspect);
    step.destinations = this.getRandomLinksFrom(step.article, 4);

    return step;

  },

  getUseableRandomArticle: async function getUseableRandomArticle() {

    let useable = false;

    do {
      const id = await this.getRandomArticleId();
      const article = await this.getArticleById(id);
      useable = this.isUseableArticle(article);
    } while (!useable);

    return useable;

  },

  generateSuspect: async function generateSuspect() {

    const id = suspects[randomInt(suspects.length)];
    return this.getArticleById(id);

  },

  generateGameSteps: async function generateGameSteps(numSteps) {

    const steps = [];
    const loot = await this.getUseableRandomArticle();
    // console.log("pushing " + loot.title);
    steps.push(loot);

    for (let i = 1; i < numSteps; i++) {
      // console.log("==== step " + i + " ====");
      // console.log("there are " + steps.length + " steps in the array");

      const link = await this.findUseableLinkFrom(steps[i-1]);

      // console.log("found " + link.title);
      const article = await this.getArticleByTitle(link.title);

      // console.log("pushing " + article.title);
      steps.push(article);

      // console.log("==== end of step " + i + " ====");
      // console.log("there are " + steps.length + " steps in the array");
    }

    return steps;

  },

  addMetadata(steps, suspect) {

    for (let i = 0, l = steps.length - 1; i < l; i++) {

      const destinations = this.getRandomLinksFrom(steps[i], 4);
      destinations.push(steps[i + 1].title);
      steps[i].destinations = destinations;

      const clues = this.addClues(steps[i + 1], suspect);
      steps[i].clues = clues;

    }

    return steps;

  },

  generateMystery: async function generateMystery(numSteps = 5) {

    // console.log("====================");
    // console.log("generating a game");

    let game = {};

    game.suspect = await this.generateSuspect();

    const steps = await this.generateGameSteps(5);
    game.steps =  this.addMetadata(steps, game.suspect);

    // const meta = this.addMetadata(game);
    // game.clues = meta.clues;
    // game.destinations = meta.destinations;

    // console.log("finished the game");
    // console.log("====================");

    return game;

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
