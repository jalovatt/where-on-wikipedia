module.exports = function(helpers) {
  const index = require('./index')();
  console.log(JSON.stringify(helpers, null, 2));
  const user = require('./user')(helpers.user);
  const game = require('./game')(helpers.game);

  return {index, user, game};
};
