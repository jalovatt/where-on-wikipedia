async function startApp() {

  require("dotenv").config();
  const express = require('express');
  const cookieParser = require('cookie-parser');
  const logger = require('morgan');
  const cookieSession = require('cookie-session');
  const bcrypt = require('bcrypt');
  const bodyParser = require("body-parser");

  const mongo = require("mongodb");
  const db = await require("./db/db")(mongo, process.env.MONGODB_URI);
  console.log("Connected to database at: " + process.env.MONGODB_URI);

  const wiki = require("./wiki-api/wiki");
  const helpers = require("./helpers/helpers")(db, bcrypt, wiki);
  const controllers = require("./controllers/controllers")(helpers);
  const router = require("./routes/router")(express, controllers);

  const app = express();

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(cookieSession({
    name: "session",
    keys: ["secretsecret"],
    maxAge: 60 * 60 * 1000 // session cookie time length
  }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.static("public"));

  app.set("view engine", "ejs");

  app.use(router);

  app.listen(process.env.PORT, () => {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] Listening on port ${process.env.PORT}`);
  });

}

startApp();
