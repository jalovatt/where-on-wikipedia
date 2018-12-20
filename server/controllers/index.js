module.exports = function(helpers) {

  return {
    getIndex(req, res, next) {
      let templateVar = {
        // user: users[req.cookies["user_id"]]};
        user: "hi there"};
      console.log()
      res.render("index", { title: "Where in Wikipedia", templateVar });
    }
  };

};
