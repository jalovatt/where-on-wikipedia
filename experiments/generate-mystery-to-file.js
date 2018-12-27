const fs = require("fs");

const request = require("request");
const wiki = require("../server/wiki-api/wiki")(request);
const gameBuilder = require("../server/helpers/game-builder")(wiki);

async function writeGame() {
  const game = await gameBuilder.generateGame(5);
  fs.writeFileSync("./experiments/example-game.txt", JSON.stringify(game, null, 2));
}

writeGame();
