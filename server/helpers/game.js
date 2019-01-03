module.exports = function(db, gameBuilder) {
  const exampleGameId = "example";

  return {

    async createGame() {
      // const id = exampleGameId;
      const game = await gameBuilder.generateGame();
      const err = await db.storeGame(game);

      return (err) ? [err] : [null, game];
    },

    async newGame() {

      const [err, game] = await this.createGame();
      if (err) return [err];

      const step = game.steps[0];

      return [null, {
        gameid: game["_id"],
        pageid: step.pageid,
        title: step.title,
        url: step.canonicalurl.replace("en.", "en.m."),
        destinations: step.destinations,
        clues: step.clues
      }];

    },

    async travelTo(gameId, articleId) {

      // *** For testing, remove at some point ***
      //gameId = exampleGameId;

      const [err, step] = await db.findStepByArticle(gameId, articleId);
      if (err) return [err];

      if (!step || !step.clues) return [null, {
        gameid: gameId,
        pageid: articleId,
        clues: Array(5).fill("Nobody seems to know what you're talking about"),
        destinations: Array(5).fill("Nobody knows where the suspect might have gone"),
        deadend: true
      }];

      return [null, {
        gameid: gameId,
        pageid: articleId,
        title: step.title,
        url: step.canonicalurl.replace("en.", "en.m."),
        destinations: step.destinations,
        clues: step.clues
      }];
    }

  };

};
