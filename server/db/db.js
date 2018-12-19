module.exports = async function(mongo) {

  const dbWrapper = require("./wrapper");

  const client = new mongo.MongoClient(
    process.env.MONGODB_URI,
    {useNewUrlParser: true}
  );

  const db = await client.connect()
    .then((client) => {
      return client.db(process.env.DB_NAME);
    });

  return dbWrapper(db);

};
