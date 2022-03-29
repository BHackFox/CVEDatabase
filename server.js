const express = require('express')
const app = express();
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const fs = require('fs');
const initializePassport = require('./user/passport-config');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "fede",
    password: "fede",
    database: "CVEDatabase",
});
const infoLogin = require('./user/info-login');
const createTable = require('./user/createTable');
const insertUser = require('./mysql/POST/insertUser');
const account = require('./routes/account');
const group = require('./routes/group');
const cve = require('./routes/cve');

initializePassport(passport,
  async username => await infoLogin(connection,`SELECT Password,id FROM Users WHERE Username = "${username}"`),
  async id => await infoLogin(connection,`SELECT Username FROM Users WHERE id = "${id}"`)
)

app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.set('view engine','ejs')
app.use(flash())
app.use(express.urlencoded({
  extended: false
}))


app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get("/",(req,res)=>{
  req.session.error = "";
  if (req.user) {
    res.render('home',{username:req.user.Username});
  }
  else {
    res.render('home',{username:false})
  }
})

app.get('/login',checkNotAuthenticated,async(req,res)=>{
  req.session.redirect = "/"
  res.render('login');
})

app.get('/register',checkNotAuthenticated,async(req,res)=>{
  res.render('register',{error:req.session.error});
})


app.post('/login',passport.authenticate('local',{
  failureRedirect: '/login',
  failureFlash: true
}),(req,res)=>{

  res.redirect(req.session.redirect)
})

app.post("/register",async (req,res)=>{

  if (!req.body.username || !req.body.email || !req.body.password){
    req.session.error = "Need Username, Email and Password!"
    res.redirect("/register")
  }
  else {
    let data = {Username:req.body.username,Email:req.body.email,Password:req.body.password};
    req.session.error = ""
    let user = await infoLogin(connection,`SELECT Username,Email FROM Users WHERE Username = "${req.body.username}" or Email = "${req.body.email}"`)
    if (user){
      console.log(user);
      if (user.Username == req.body.username){
        req.session.error = "Username Already in Use"
      }
      if (user.Email == req.body.email){
        req.session.error = "Email Already in Use"
      }
      res.redirect('/register')
    }
    else {
      insertUser(connection,data)
      res.redirect('/login')
    }
  }
})

app.get("/recreate",async (req,res)=>{
  try {
    await createTable(connection);
  } catch (e) {
    console.error(e);
    res.send("NO")
  } finally {
    console.log("Fatto");
    res.send("Ok")
  }
})

app.use("/account",checkAuthenticated,account);

app.use("/group",checkAuthenticated,group);
app.use("/CVE",cve);

function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return res.redirect('/')
  }
  next()
}
function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}


app.listen(process.env.PORT || 3000)
