module.exports = function(db) {

  const exampleGameId = "5c197a4b956aa4a4c5851a39";
  const exampleGame = db.loadGame(exampleGameId);

  return {

    newGame: async function newGame() {

      const id = exampleGameId;
      const step = await db.loadStep(id, 0);

      return {
        id,
        title: step.title,
        destinations: step.destinations,
        clues: step.clues
      };

    }

  };

};
