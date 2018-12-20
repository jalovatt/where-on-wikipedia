module.exports = function(db, gameBuilder) {
  const exampleGameId = "example";

  return {

    async newGame() {
      const id = exampleGameId;
      const step = await db.loadStep(id, 0);

      return {
        gameid: id,
        pageid: step.pageid,
        title: step.title,
        url: step.canonicalurl,
        destinations: step.destinations,
        clues: step.clues
      };
    },

    async travelTo(gameId, articleId) {

      // *** For testing, remove at some point ***
      gameId = exampleGameId;

      const step = await db.findStepByArticle(gameId, articleId);

      return (!step) ? null : {
        gameid: gameId,
        pageid: step.pageid,
        title: step.title,
        url: step.canonicalurl,
        destinations: step.destinations,
        clues: step.clues
      };
    }

  };

};
