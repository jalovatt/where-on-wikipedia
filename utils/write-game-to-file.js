require("dotenv").config();
const fs = require("fs");
const mongo = require("mongodb");


async function loadGame(gameId) {
  const client = new mongo.MongoClient(
    process.env.MONGODB_URI,
    {useNewUrlParser: true}
  );

  const db = await client.connect()
    .then((client) => client.db(process.env.DB_NAME));

  const games = db.collection("games");

  return await games.findOne({["_id"]: gameId});
}



async function writeGameToFile(id) {
  if (!id) return console.log("Please provide a game id.");

  const game = await loadGame(id);
  if (!game) return console.log("Couldn't find a game with that id.");

  const path = `./temp/${id}.json`;
  fs.writeFileSync(path, JSON.stringify(game, null, 2));

  console.log(`Wrote game ${id} to: ${path}`);
  process.exit();
}

writeGameToFile(process.argv[2]);
