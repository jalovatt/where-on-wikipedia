const exampleGame = require("./seed-data/games");
const exampleUser = require("./seed-data/users");

async function seedDb() {

  require("dotenv").config();
  const mongo = require("mongodb");

  const client = new mongo.MongoClient(
    process.env.MONGODB_URI,
    {useNewUrlParser: true}
  );

  const db = await client.connect()
    .then((client) => {
      return client.db(process.env.DB_NAME);
    });

  console.log("Connected to database at: " + process.env.MONGODB_URI);

  console.log("Dropping collection 'games'");

  // Make sure 'games' exists so dropping it doesn't return an error
  await db.collection("games").insertOne({});
  await db.collection("games").drop();

  console.log("Adding example game");
  await db.collection("games").insertOne(exampleGame);

  console.log("Dropping collection 'users'");

  // Make sure 'users' exists so dropping it doesn't return an error
  await db.collection("users").insertOne({});
  await db.collection("users").drop();

  console.log("Adding example user");
  await db.collection("users").insertOne(exampleUser);

  console.log("All done!");

  client.close();

}

seedDb();
