const fs = require("fs");

const request = require("request");
const wiki = require("../server/wiki-api/wiki")(request);
const gameBuilder = require("../server/helpers/game-builder")(wiki);

async function writeGame(id) {

  console.log("Generating game, will take a few seconds...");
  const game = await gameBuilder.generateGame(5, id);
  const path = `./temp/${game["_id"]}.json`;
  fs.writeFileSync(path, JSON.stringify(game, null, 2));

  console.log(`Generate game ${game["_id"]} and wrote it to: ${path}`);
  process.exit();
}

const id = process.argv[2];

writeGame(id);
