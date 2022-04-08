const express = require('express')
const route = express.Router()
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "fede",
    password: "fede",
    database: "CVEDatabase",
});
const getUser = require('../mysql/GET/getUser');
const getGeneralQuery = require('../mysql/GET/getGeneralQuery');
const postGeneralQuery = require('../mysql/POST/postGeneralQuery');

route.use(express.static('public'))


route.get("/",async (req,res)=>{
  req.session.redirect = "/account/"
  let user = req.user.Email;
  let account = await getUser(connection,`SELECT Username,Email,Name,Surname FROM Users WHERE Username = "${req.user.Username}"`);
  let group = await getGeneralQuery(connection,`SELECT * FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.Username = "${req.user.Username}"`);
  res.render("account",{username:user,data:account,group:group[0]})
})

route.get("/group",async(req,res)=>{
  let user = req.user.Email;
  let group = await getGeneralQuery(connection,`SELECT * FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.Username = "${req.user.Username}"`);
  let users = await getGeneralQuery(connection,`SELECT * FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.GroupName = "${group[0].GroupName}"`);
  res.render("group",{username:user,data:group[0],users:users})
})




module.exports = route;
