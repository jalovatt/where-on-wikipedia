var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();


const users = {
}

// functions

function generateRandomString() {
 return  Math.random().toString(36).replace('0.', '') .slice(5);
 };

 function canRegistered(email) {
   let signal = true;
   for (let user in users) {
     if (users[user].email === email) {
       return false;
     }
   }
   return true;
 }


 function addUser(email, password) {
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
 }

function findUser(email, password) {
   for (let user in users) {
     if (users[user].email === email
       && bcrypt.compareSync(password, users[user].password)) {
       return user;
     }
   }
   return "";
 }

/* GET home page. */
router.get('/', function(req, res, next) {
   let templateVar = {
   user: users[req.cookies["user_id"]]};
   console.log()
  res.render('index', { title: 'Express', templateVar });
});

router.get("/users.json", (req, res) => {
   res.json(users);
 });


router.get("/login", (req, res) => {
   let templateVar = {
   user: users[req.cookies["user_id"]]};
  let userId = templateVar.user
  if(!userId || !users[userId]) {
    res.render("login", {});
  } else {
    res.redirect("/");
  }
});

router.get("/register", (req, res) => {
   let templateVar = {
   user: users[req.cookies["user_id"]]};
   console.log(templateVar)
   let userId = templateVar.user
  if(!userId || !users[userId]) {
    res.render("register", { errMsg: "" });
  } else {
    res.redirect("/");
  }
});

router.post("/login", (req, res) => {
  let templateVar = {
    user: [req.cookies]};
   if (!req.body.email || !req.body.password) {
        res.sendStatus(400);  // Bad Request
  } else {
    let userId = findUser(req.body.email, req.body.password);
    if (!userId) {
      res.sendStatus(403);  // Forbidden
    } else {
      templateVar.user = userId;
      res.redirect("/");
    }
  }
});

router.post("/logout", (req, res)=>{
    res.clearCookie("user_id");
    res.redirect('/')
})


router.post("/register", (req, res) => {
  let templateVar = {
    user: [req.cookies]};
  let email = req.body.email;
  let password = req.body.password;
  if (!email || !password) {
    res.sendStatus(400);
  } else {
    if (canRegistered(email)) {
      let userId = addUser(email, password);
      templateVar.user = userId;
      res.cookie("user_id", templateVar.user);
      res.redirect("/");
    } else {
      res.render("register", { errMsg: `${email} had already been registered.` });
    }
  }



  console.log(users)
  console.log(req.body.email)
});


module.exports = router;