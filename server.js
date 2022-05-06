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
const user = require('./routes/user');
const api = require('./routes/api');
const tag = require('./routes/tag');
const getGeneralQuery = require('./mysql/GET/getGeneralQuery');

initializePassport(passport,
  async username => await infoLogin(connection,`SELECT Password,id FROM Users WHERE Username = "${username}"`),
  async id => await infoLogin(connection,`SELECT Username,Email FROM Users WHERE id = "${id}"`)
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


app.get("/",async (req,res)=>{
  req.session.error = "";
  var ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress).substring(7);
  console.log(ip);
  var data = fs.readFileSync('../ip.json',{encoding:'utf-8',flag:'r'});
  var ips = JSON.parse(data);
  if (ips[ip]) {
    ips[ip].push(new Date());
  }
  else {
    ips[ip] = []
    ips[ip].push(new Date());
  }
  fs.writeFileSync('../ip.json', JSON.stringify(ips,null,2))
  req.session.redirect = "/";
  if (req.query.join) {
    console.log("si");
    let url = await getGeneralQuery(connection,`SELECT * from InviteInGroup WHERE UrlInvite="${req.query.join}" AND Used=0`);
    console.log(url);
    if(url[0]){
      req.session.redirect = "/?join="+req.query.join;
      if (req.user && req.user.Username == url[0].Username) {
        console.log("h1");
        res.render('join',{username:req.user,join:true,data:url[0]});
      }
      else {
        let user = false;
        if (req.user) {
          user = req.user;
        }
        res.render('join',{username:user,join:false,data:url[0]});
      }
    }
    else {
      res.redirect("/")
    }
  }
  else {
    if (req.user) {
      res.render('home',{username:req.user});
    }
    else {
      res.render('home',{username:false})
    }
  }
})

app.get('/login',checkNotAuthenticated,async(req,res)=>{
  res.render('login');
})

app.get('/register',checkNotAuthenticated,async(req,res)=>{
  res.render('register',{error:req.session.error});
})


app.post('/login',passport.authenticate('local',{
  failureRedirect: '/login',
  failureFlash: true
}),(req,res)=>{
  if (!req.session.redirect) {
    res.redirect("/account")
  }
  else {
    res.redirect(req.session.redirect)
  }
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
    res.send(e)
  }
    res.redirect("/");
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/minecraft',(req,res)=>{
  res.json({ip:"84.221.10.247",port:25565})
})

app.use("/account",checkAuthenticated,account);

app.use("/group",group);
app.use("/CVE",cve);
app.use("/user",user);
app.use("/api",api);
app.use("/tag",tag);

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
