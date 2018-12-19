module.exports = function(helper) {

  // const userHelper = require("../helpers/user")(db, bcrypt);

  const userController = {
    // getLogin(req, res) {
    //   let templateVar = {
    //     user: users[req.cookies["user_id"]]};
    //   let userId = templateVar.user;
    //   if(!userId || !users[userId]) {
    //     res.render("login", {});
    //   } else {
    //     res.redirect("/");
    //   }
    // },

    async postLogin(req, res) {
      const [err, user] = await helper.validateLogin(req.body.email, req.body.password);
      if (err) {
        res.status(400)
          .json({
            error: err
          });
      } else {
        res.cookie("user-email", user.email).json(user);
      }
    },

    // getRegister(req, res) {
    //   let templateVar = {
    //     user: users[req.cookies["user_id"]]};
    //   console.log(templateVar)
    //   let userId = templateVar.user;
    //   if(!userId || !users[userId]) {
    //     res.render("register", { errMsg: "" });
    //   } else {
    //     res.redirect("/");
    //   }
    // },

    async postRegister(req, res) {

      const [err, email] = await helper.newUser(req.body.email, req.body.name, req.body.password);

      if (err) {
        res.status(400)
          .json({error: err});
      } else {
        res.cookie("user-email", email);
      }
    },

    postLogout(req, res) {
      res.clearCookie("user-email");
    }

  };

  return userController;

};
