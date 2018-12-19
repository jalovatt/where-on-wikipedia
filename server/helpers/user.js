
const users = {
}

module.exports = function(db, bcrypt) {
// functions

  return {

    async newUser(email, name, password) {

      const emailAvailable = await db.isEmailAvailable(email);
      if (!emailAvailable) return ["Email address already exists"];

      const nameAvailable = await db.isNameAvailable(name);
      if (!nameAvailable) return ["Name already exists"];

      const user = {
        ["_id"]: email,
        name,
        password: bcrypt.hashSync(password, 10),
        gamesPlayed: 0,
        gamesWon: 0,
      };

      await db.registerUser(user);

      return [null, email];
    },

    async validateLogin(email, password) {

      const user = await db.findUserByEmail(email);
      if (!user) return ["User doesn't exist"];
      if (!bcrypt.compareSync(password, user.password)) {
        return ["Incorrect password"];
      }

      return [null, {
        name: user.name,
        email: user["_id"],
        played: user.gamesPlayed,
        won: user.gamesWon
      }];
    }

  };

};
