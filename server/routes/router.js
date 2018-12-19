module.exports = function(express, controllers) {
  const router = express.Router();

  router.get("/",             controllers.index.getIndex);

  router.get("/login",        controllers.user.getLogin);
  router.get("/register",     controllers.user.getRegister);

  router.post("/login",       controllers.user.postLogin);
  router.post("/logout",      controllers.user.postLogout);
  router.post("/register",    controllers.user.postRegister);

  router.get("/game/new",     controllers.game.getNew);
  router.get("/game/:gameId/travel/:articleId",
                              controllers.game.getTravel);
  // router.get("/game/:gameId/search/:articleId",
  //                             controllers.game.getSearch);
  router.get("/game/:gameId/capture/:articleId/:suspectId",
                              controllers.game.getCapture);

  return router;
};
