module.exports = async function(mongo, MONGODB_URI) {

  const dbWrapper = require("./wrapper");

  const db = await mongo.connect(
    MONGODB_URI,
    {useNewUrlParser: true}
  ).then((client) => {
    return client.db(process.env.DB_NAME);
  });

  return dbWrapper(mongo, db);

};
