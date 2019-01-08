module.exports = async function(mongo) {

  const client = new mongo.MongoClient(
    process.env.MONGODB_URI,
    {useNewUrlParser: true}
  );

  const db = await client.connect()
    .then((client) => client.db(process.env.DB_NAME));

  const users = db.collection("users");
  const games = db.collection("games");

  return {

    async loadGame(gameId) {
      return await games.findOne({["_id"]: gameId});
    },

    async storeGame(game) {
      const ret = await games.insertOne(game);
      return !ret;
    },

    async loadStep(gameId, step) {
      const result = await games
        .findOne({["_id"]: gameId}, {projection: {steps: 1}});


      return (result && result.steps) ? result.steps[step] : null;
    },

    async findStepByArticle(gameId, articleId) {
      const game = await this.loadGame(gameId);
      if (!game) return ["Couldn't find game with that ID"];

      const step = game.steps.find((step) => Number(step.pageid) === Number(articleId));
      return (!step) && [null, {}] || [null, step];
    },

    async findDestinationTitle(gameId, articleId) {
      const game = await this.loadGame(gameId);
      if (!game) return ["Couldn't find game with that ID"];

      const destinations = game.steps.reduce((acc, step) => acc.concat(step.destinations), []);
      const dest = destinations.find((dest) => dest.id.toString() === articleId);

      return (dest) ? [null, dest] : ["Couldn't find a destination with that ID"];

    },

    async findUserByEmail(email) {
      const searchEmail = email.trim().toLowerCase();

      return await users.findOne({["_id"]: email});
    },

    async isEmailAvailable(email) {
      const searchEmail = email.trim().toLowerCase();
      const result = await users.findOne({["_id"]: searchEmail});

      return !result;
    },

    async isNameAvailable(name) {
      const result = await users.findOne({name});

      return !result;
    },

    async registerUser(user) {
      await users.insertOne(user);
    }

  };

};
