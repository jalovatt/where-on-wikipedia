module.exports = function(mongo, db) {

  const users = db.collection("users");
  const games = db.collection("games");

  return {

    loadGame: async function(gameId) {
      return await games.findOne(mongo.ObjectId(gameId));
    },

    storeGame: async function(game) {
      return await games.insertOne(game);
    },

    loadStep: async function(gameId, step) {

      console.log(`Attempting to load game ${gameId}, step ${step}`);

      const steps = await games
        .findOne(mongo.ObjectId(gameId), {steps: 1});

      return steps[step];
    },

  };
};
