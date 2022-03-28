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

initializePassport(passport,
  async username => await infoLogin(connection,username),
  async id => await infoLogin(connection,id)
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
  if (req.user) {
    console.log(req.user)
    res.render('home',{username:req.user.Username})
  }
  else {
    res.render('home',{username:false})
  }
})

app.get('/login',checkNotAuthenticated,async(req,res)=>{
  req.session.redirect = "/"
  res.render('login');
})


app.post('/login',passport.authenticate('local',{
  failureRedirect: '/login',
  failureFlash: true
}),(req,res)=>{
  res.redirect(req.session.redirect)
})

app.get("/create",(req,res)=>{
  createTable(connection);
  console.log("Fatto");
  res.send("Ok")
})

app.post("/newUser",(req,res)=>{
  let data = {Username:req.body.Username,Email:req.body.Email,Password:req.body.Password};
  console.log(data);
  insertUser(connection,data)
  res.send("OK")
})

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
