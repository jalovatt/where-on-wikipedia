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

// https://stackoverflow.com/a/10986669/9667199
function generateGameId() {
  return new Date().getTime().toString(36).toUpperCase();
}

module.exports = function(wiki) {

  return {

    getRandomLinkFrom(article) {
      return article.links[randomInt(article.links.length)].title;
    },

    getRandomLinkTo(article) {
      return article.linkshere[randomInt(article.linkshere.length)].title;
    },

    getRandomCategory(article) {
      return article.categories[randomInt(article.categories.length)].title;
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
      let useable = false;

      do {
        const curLink = this.getRandomLinkFrom(article);
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
      // - Article that links here
      const linksHere = (article) => {
        const str = "The suspect asked for directions to an article mentioned in '%ARTICLE%'";
        const link = this.getRandomLinkTo(article);
        return str.replace("%ARTICLE%", link);
      };

      // - Category that this belongs to
      const category = (article) => {
        const str = "The suspect expressed an interest in '%CATEGORY%'";
        const cat = this.getRandomCategory(article);
        return str.replace("%CATEGORY%", cat);
      };

      const clueTypes = [linksHere, category];
      return clueTypes[randomInt(clueTypes.length)](article);
    },

    generateSuspectClue(suspect) {
      return this.generateArticleClue(suspect);
    },

    existsInArray(val, arr) {
      return arr.indexOf(val) > -1;
    },

    generateNewArticleClue(article, clueArr) {
      let clue;
      do {
        clue = this.generateArticleClue(article);
      } while (this.existsInArray(clue, clueArr));

      return clue;
    },

    // Fisher-Yates shuffling algorithm:
    // https://bost.ocks.org/mike/shuffle/
    shuffleArray(arr) {
      const out = [...arr];
      let left = out.length, swap, take;

      while (left) {

        // Pick a remaining element…
        take = Math.floor(Math.random() * left--);

        // And swap it with the current element.
        swap = out[left];
        out[left] = out[take];
        out[take] = swap;
      }

      return out;
    },

    addClues(article, suspect) {
      const clues = [];
      while (clues.length < 5) {
        clues.push(this.generateNewArticleClue(article, clues));
      }

      // Chance to replace two clues with suspect clues
      (randomInt(2) === 1) && (clues[0] = this.generateSuspectClue(suspect));
      (randomInt(2) === 1) && (clues[1] = this.generateSuspectClue(suspect));

      return this.shuffleArray(clues);
    },

    generateNewDestination(article, dests) {
      let dest;
      do {
        dest = this.getRandomLinkFrom(article);
      } while (this.existsInArray(dest, dests));

      return dest;
    },

    addDestinations(article, include) {
      const dests = [include];
      while (dests.length < 4) {
        dests.push(this.generateNewDestination(article, dests));
      }

      return this.shuffleArray(dests);
    },

    addMetadata(steps, suspect) {
      for (let i = 0, l = steps.length - 1; i < l; i++) {

        const destinations = this.addDestinations(steps[i], steps[i + 1].title);
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
      steps.push(loot);

      this.logMystery && console.log(`\t- ${loot.title}`);

      for (let i = 1; i < numSteps; i++) {
        const link = await this.findUseableLinkFrom(steps[i-1]);
        const article = await this.getArticleByTitle(link.title);
        steps.push(article);

        this.logMystery && console.log(`\t- ${article.title}`);
      }

      return steps;
    },

    async generateGame(numSteps = 5) {
      let game = {};

      game.suspect = await this.generateSuspect();
      const steps = await this.generateGameSteps(5);

      game.steps =  this.addMetadata(steps, game.suspect);

      game["_id"] = generateGameId();

      return game;
    },

    searchArticle() {

    }

  };

};
