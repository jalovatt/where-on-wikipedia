module.exports = function(helpers) {

  return {
    getIndex(req, res, next) {
      res.render("index", { title: "Where in Wikipedia" });
    }
  };

};
