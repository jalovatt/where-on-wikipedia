module.exports = function(helper) {

  return {

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

};
