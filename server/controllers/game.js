module.exports = function(helper) {

  return {

    async getNew(req, res, next) {
      const newGameData = await helper.newGame();

      res.json(newGameData);
    },

    async getTravel(req, res, next) {
      const gameId = req.params.gameId;
      const articleId = req.params.articleId;
      const stepData = await helper.travelTo(gameId, articleId);

      res.json(stepData);
    },

    async getCapture(req, res, next) {
      res.json({query: "You found GET /capture"});
    }

  };

};
