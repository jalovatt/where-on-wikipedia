module.exports = function(db, bcrypt, wiki) {
  const user = require("./user")(db, bcrypt);

  const gameBuilder = require("./game-builder")(wiki);
  const game = require("./game")(db, gameBuilder);

  return {user, game};
};
