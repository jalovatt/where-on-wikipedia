async function startApp() {

  // Node dependencies
  require("dotenv").config();
  const express = require('express');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');
  const cookieSession = require('cookie-session');
  const bcrypt = require('bcrypt');
  const bodyParser = require("body-parser");
  const request = require("request");
  const mongo = require("mongodb");


  // Connect to the database
  const db = await require("./db/db")(mongo);
  (process.env.NODE_ENV !== "test")
    && console.log("Connected to database at: " + process.env.MONGODB_URI);

  // All of our modules
  const wiki = require("./wiki-api/wiki")(request);
  const helpers = require("./helpers/helpers")(db, bcrypt, wiki);
  const controllers = require("./controllers/controllers")(helpers);

  const router = express.Router();
  require("./routes/router")(router, controllers);

  // Express setup
  const app = express();
  (process.env.NODE_ENV !== "test" && process.env.NODE_ENV !== "production")
    && app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cookieSession({
    name: "session",
    keys: ["secretsecret"],
    maxAge: 60 * 60 * 1000
  }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));

  app.use(router);

  // Start the server
  return app.listen(process.env.PORT, () => {
    const time = new Date().toLocaleTimeString();
    (process.env.NODE_ENV !== "test")
      && console.log(`[${time}] Listening on port ${process.env.PORT}`);
  });

}

// Exporting so chai-http can use the app
module.exports = startApp();
