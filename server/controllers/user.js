module.exports = function(db, bcrypt) {

  const userHelper = require("../helpers/user")(db, bcrypt);

  const userController = {
    getLogin(req, res) {
      let templateVar = {
        user: users[req.cookies["user_id"]]};
      let userId = templateVar.user;
      if(!userId || !users[userId]) {
        res.render("login", {});
      } else {
        res.redirect("/");
      }
    },

    postLogin(req, res) {
      let templateVar = {
        user: [req.cookies]};
      if (!req.body.email || !req.body.password) {
        res.sendStatus(400);  // Bad Request
      } else {
        let userId = userHelper.findUser(req.body.email, req.body.password);
        if (!userId) {
          res.sendStatus(403);  // Forbidden
        } else {
          templateVar.user = userId;
          res.cookie("user_id", templateVar.user);
          console.log("blah")
          console.log(templateVar.user)
          res.redirect("/");
        }
      }
    },

    getRegister(req, res) {
      let templateVar = {
        user: users[req.cookies["user_id"]]};
      console.log(templateVar)
      let userId = templateVar.user;
      if(!userId || !users[userId]) {
        res.render("register", { errMsg: "" });
      } else {
        res.redirect("/");
      }
    },

    postRegister(req, res) {
      let templateVar = {
        user: [req.cookies]};
      let email = req.body.email;
      let password = req.body.password;
      if (!email || !password) {
        res.sendStatus(400);
      } else {
        if (userHelper.canRegistered(email)) {
          let userId = userHelper.addUser(email, password);
          templateVar.user = userId;
          res.cookie("user_id", templateVar.user);
          res.redirect("/");
        } else {
          res.render("register", { errMsg: `${email} had already been registered.` });
        }
      }
    },

    postLogout(req, res) {
      res.clearCookie("user_id");
      res.redirect('/')
    }

  };

  return userController;

};
