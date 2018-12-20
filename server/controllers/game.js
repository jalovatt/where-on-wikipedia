module.exports = function(helper) {

  return {

    async getNew(req, res, next) {
      const [err, step] = await helper.newGame();

      if (err) {
        res.status(500)
          .json({error: err});
      } else {
        res.json(step);
      }
    },

    async getTravel(req, res, next) {
      const gameId = req.params.gameId;
      const articleId = req.params.articleId;
      const [err, step] = await helper.travelTo(gameId, articleId);

      if (err) {
        res.status(500)
          .json({error: err});
      } else {
        res.json(step);
      }
    },

    async getCapture(req, res, next) {
      res.json({query: "You found GET /capture"});
    }

  };

};
