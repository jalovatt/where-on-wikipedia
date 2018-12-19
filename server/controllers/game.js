module.exports = function(helper) {

  return {

    getNew: async function getNew(req, res, next) {
      const newGameData = await helper.newGame();
      res.json(newGameData);
    },

    getSearch: async function getSearch(req, res, next) {
      const gameId = req.params.gameId;
      const articleId = req.params.articleId;
      res.json({query: `You found GET /search: game ${gameId}, article ${articleId}`});

    },

    getCapture: async function getCapture(req, res, next) {
      res.json({query: "You found GET /capture"});

    }

  };

};
