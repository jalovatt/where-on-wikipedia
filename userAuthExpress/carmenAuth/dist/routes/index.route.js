'use strict';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.get("/register", function (req, res) {
  var templateVar = {
    user: [req.cookies] };
  console.log(templateVar);
  res.render("register", templateVar);
});

module.exports = router;