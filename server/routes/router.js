module.exports = function(router, controllers) {
  router.get("/",             controllers.index.getIndex);

  router.post("/login",       controllers.user.postLogin);
  router.post("/logout",      controllers.user.postLogout);
  router.post("/register",    controllers.user.postRegister);

  router.get("/game/new",     controllers.game.getNew);
  router.get("/game/:gameId/travel/:articleId",
                              controllers.game.getTravel);
  router.get("/game/:gameId/capture/:articleId/:suspectId",
                              controllers.game.getCapture);
};
