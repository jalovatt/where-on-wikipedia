module.exports = function(db, bcrypt, wiki) {
  const user = require("./user")(db, bcrypt);
  const game = require("./game")(db, wiki);

  return {user, game};
};
