module.exports = function(helpers) {
  const index = require('./index')();
  const user = require('./user')(helpers.user);
  const game = require('./game')(helpers.game);

  return {index, user, game};
};
