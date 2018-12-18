module.exports = function(db, bcrypt) {
  const user = require("./user")(db, bcrypt);
  const game = require("./game")(db);

  return {user, game};
};
