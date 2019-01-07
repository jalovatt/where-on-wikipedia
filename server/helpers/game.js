module.exports = function(db, gameBuilder) {
  const exampleGameId = "example";

  function stepToJSON(gameId, step) {

    return [null, {
      gameid: gameId,
      pageid: step.pageid,
      title: step.title,
      url: step.canonicalurl.replace("en.", "en.m."),
      destinations: step.destinations,
      clues: step.clues,
      finalstep: step.finalstep
    }];

  }

  return {

    async createGame() {
      // const id = exampleGameId;
      const game = await gameBuilder.generateGame();
      const err = await db.storeGame(game);

      return (err) ? [err] : [null, game];
    },

    async loadGame(gameId) {

      const game = await db.loadGame(gameId);

      return (!game) ? ["Error loading the specified game"] : [null, game];
    },

    async newGame() {

      const [err, game] = await this.createGame();
      if (err) return [err];

      const step = game.steps[0];

      return stepToJSON(game["_id"], step);

    },

    async startGame(gameId) {

      const [err, game] = await this.loadGame(gameId);
      if (err) return [err];

      const step = game.steps[0];

      return stepToJSON(game["_id"], step);

    },

    async travelTo(gameId, articleId) {

      // *** For testing, remove at some point ***
      //gameId = exampleGameId;

      const [err, step] = await db.findStepByArticle(gameId, articleId);
      if (err) return [err];

      if (!step.finalstep && (!step || !step.clues)) return [null, {
        gameid: gameId,
        pageid: articleId,
        clues: Array(5).fill("Nobody seems to know what you're talking about"),
        destinations: Array(5).fill("Nobody knows where the suspect might have gone"),
        deadend: true
      }];

      return stepToJSON(gameId, step);
    },

    async checkCapture(gameId, articleId, suspectId) {

      const game = await db.loadGame(gameId);
      if (!game) return ["The specified game doesn't exist"];

      const lastId = game.steps[game.steps.length - 1].pageid.toString();

      // console.log("article should be " + lastId);
      if (articleId !== lastId) return ["The suspect isn't here"];

      if (suspectId !== game.suspect.pageid.toString()) return [null, {message: "Your warrant was for the wrong person"}];

      return [null, {message: `You caught the suspect!\n(game ${gameId}, article ${articleId}, suspect ${suspectId}`}];

    }

  };

};
