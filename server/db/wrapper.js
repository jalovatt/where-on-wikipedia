module.exports = function(mongo, db) {

  const users = db.collection("users");
  const games = db.collection("games");

  return {

    async loadGame(gameId) {
      return await games.findOne(mongo.ObjectId(gameId));
    },

    async storeGame(game) {
      return await games.insertOne(game);
    },

    async loadStep(gameId, step) {

      const result = await games
        .findOne(mongo.ObjectId(gameId), {projection: {steps: 1}});


      return (result && result.steps) ? result.steps[step] : null;
    },

    async findStepByArticle(gameId, articleId) {

      const game = await this.loadGame(gameId);
      const step = game.steps.find((step) => Number(step.pageid) === Number(articleId));

      console.log("===================\n");
      console.log(step);
      console.log("\n===================");

      return (step) ? step : null;
    }

  };
};
