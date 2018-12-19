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

function randomInt(n) {
  return Math.floor(Math.random() * n);
}

module.exports = function(wiki) {

  return {

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

    async findUseableLinkFrom(article) {

      // console.log("finding useable link from article: " + article.title);

      let useable = false;

      do {

        const curLink = this.getRandomLinkFrom(article).title;

        const curId = await wiki.getArticleIdFromTitle(curLink);

        if (!curId || curId === "0") continue;

        const curArticle = await wiki.getArticleById(curId);

        useable = this.isUseableArticle(curArticle);

        !useable && this.logMystery && console.log("\t\t.");

      } while (!useable);

      return useable;

    },

    async generateNextStep(prevArticle, suspect) {

      const nextLink = await this.findUseableLinkFrom(prevArticle);

      const step = {};
      step.article = await this.getArticleByTitle(nextLink.title);

      step.clues = this.addClues(step.article, suspect);
      step.destinations = this.getRandomLinksFrom(step.article, 4);

      return step;

    },

    async getUseableRandomArticle() {

      let useable = false;

      do {
        const id = await wiki.getRandomArticleId();
        const article = await wiki.getArticleById(id);
        useable = this.isUseableArticle(article);
      } while (!useable);

      return useable;

    },

    async generateSuspect() {

      const id = suspects[randomInt(suspects.length)];
      return wiki.getArticleById(id);

    },

    async getArticleByTitle(articleTitle) {

      const articleId = await wiki.getArticleIdFromTitle(articleTitle);
      return wiki.getArticleById(articleId);

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

    async generateGameSteps(numSteps) {

      this.logMystery && console.log("\tGenerating steps...");
      const steps = [];
      const loot = await this.getUseableRandomArticle();

      this.logMystery && console.log(`\t- ${loot.title}`);

      steps.push(loot);

      for (let i = 1; i < numSteps; i++) {
        // console.log("==== step " + i + " ====");
        // console.log("there are " + steps.length + " steps in the array");

        const link = await this.findUseableLinkFrom(steps[i-1]);

        // console.log("found " + link.title);
        const article = await this.getArticleByTitle(link.title);

        // console.log("pushing " + article.title);
        steps.push(article);

        this.logMystery && console.log(`\t- ${article.title}`);

        // console.log("==== end of step " + i + " ====");
        // console.log("there are " + steps.length + " steps in the array");
      }

      return steps;

    },

    async generateGame(numSteps = 5) {

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

    },

    searchArticle() {

    }

  };

};
