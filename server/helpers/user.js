
const users = {
}

module.exports = function(db, bcrypt) {
// functions

  const userHelper = {
    generateRandomString() {
      return Math.random().toString(36).replace('0.', '') .slice(5);
    },

    canRegistered(email) {
      let signal = true;
      for (let user in users) {
        if (users[user].email === email) {
          return false;
        }
      }
      return true;
    },

    addUser(email, password) {
      let newUserId = "";

      do {
        newUserId = generateRandomString();
      } while(users[newUserId])
      users[newUserId] = {
        id: newUserId,
        email: email,
        password: bcrypt.hashSync(password, 10)
      };
      return newUserId;
    },

    findUser(email, password) {
      for (let user in users) {
        if (users[user].email === email
          && bcrypt.compareSync(password, users[user].password)) {
          return user;
        }
      }
      return "";
    },
  };

  return userHelper;
};
