const express = require('express')
const route = express.Router()
const getUser = require('../mysql/GET/getUser');
const getGeneralQuery = require('../mysql/GET/getGeneralQuery');
const postGeneralQuery = require('../mysql/POST/postGeneralQuery');
const mysql = require('mysql');
const socket = require('socket.io');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
    host: "localhost",
    user: "fede",
    password: "fede",
    database: "CVEDatabase",
});

route.use(express.static('public'));
route.use(bodyParser.urlencoded({
    extended: true
}));
route.use(bodyParser.json());
route.use(express.json());

route.get("/",(req,res)=>{
  req.session.redirect = "/chat";

  res.render("chat",{username:req.user});
});


route.get("/group",async (req,res)=>{
  req.session.redirect = "/chat/group";
  let group = await getGeneralQuery(connection,`SELECT GroupName FROM UserJoinGroup WHERE Username="${req.user.Username}"`)
  if (group[0].GroupName) {
    let messages = await getGeneralQuery(connection,`SELECT * FROM MessagesGroup WHERE GroupName="${group[0].GroupName}" ORDER BY TimeText`);
    res.render("chatgroup",{username:req.user,group:group[0].GroupName,messages:messages});
  }
  else {
    res.redirect("/account")
  }
});







module.exports = route;
