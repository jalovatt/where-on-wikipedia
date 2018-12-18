const queries = require("./queries");
const fs = require("fs");

async function writeMystery() {
  const mystery = await queries.generateMystery(3);
  fs.writeFileSync("./example-mystery.txt", JSON.stringify(mystery, null, 2));
}

writeMystery();
