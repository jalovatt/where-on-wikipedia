function generateRandomString() {
 return  Math.random().toString(36).replace('0.', '') .slice(5);
 };

var express = require('express');
var router = express.Router();

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/login", (req, res) => {
  let templateVar = {
  user: [req.cookies]};
  console.log(templateVar)
  res.render('login', templateVar);
});


router.get("/register", (req, res) => {
  let templateVar = {
  user: [req.cookies]};
  console.log(templateVar)
  res.render('register', templateVar);
})

router.post("/login", (req, res) => {
  let userEmail = "";
  let userPass = "";
   for (let x in users) {
    if (users[x]['email'] == req.body.email && users[x]['password'] == req.body.password) {
      userEmail = req.body.email;
      userPass = req.body.password;
      res.cookie("user_id", users[x]["id"]);
    }
  }
   if (userEmail.length > 0 && userPass.length > 0) {
    res.redirect('/');
  }
  else {
    res.sendStatus(403);
  }
 });

router.post("/logout", (req, res)=>{
    res.clearCookie("user_id");
    res.redirect('/')
})

// router.post("/login", (req, res) => {
//     console.log('req body', req.body.email)
//   res.cookie("email", req.body.email);
//    res.redirect("/")
// });

// router.post("/register", (req, res) => {
//     console.log('req body', req.body.email)
//   res.cookie("email", req.body.email);
//    res.redirect("/")
// });

router.post("/register", (req, res) => {
  let email = req.body.email;
    if (!req.body.email || !req.body.password) {
        res.status(400).send("Email and/or password field incomplete");
    }
  let matchedEmail;
    for (let i in users) {
    if (email === users[i].email) {
        matchedEmail = true
      }
    }
    if (matchedEmail) return res.status(400).send("User email already registered")
  let password = req.body.password;
  let newUserID = generateRandomString();

    users[newUserID] = {
    email: email,
    password: password,
    id: newUserID
  }

  res.cookie("user_id", newUserID);
    console.log(users)
    res.redirect('/')
})


module.exports = router;
