var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/login", (req, res) => {
  let templateVar = {
  user: [req.cookies]};
  console.log(templateVar)
  res.render("login", templateVar);
});


router.get("/register", (req, res) => {
  let templateVar = {
  user: [req.cookies]};
  console.log(templateVar)
  res.render("register", templateVar);
})






module.exports = router;
