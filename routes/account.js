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
  let group = await getGeneralQuery(connection,`SELECT * FROM Groups,UserJoinGroup WHERE Groups.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.Username = "${req.user.Username}"`);
  res.render("account",{username:user,data:account,group:group[0]})
})

route.get("/group",async(req,res)=>{
  let user = req.user;
  let group = await getGeneralQuery(connection,`SELECT SUM(NUM) AS Sum_Users,t1.GroupName,t1.GroupDescription, COUNT(t1.Username) AS N_Users FROM (SELECT Groups.GroupName,Username,Groups.GroupDescription FROM Groups,UserJoinGroup WHERE Groups.GroupName = UserJoinGroup.GroupName) AS t1 LEFT OUTER JOIN (SELECT count(CVEUserCreate) AS NUM, Username FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = Users.Username GROUP BY Users.Username) AS t2 ON t1.Username = t2.Username GROUP BY t1.GroupName,t1.GroupDescription HAVING (t1.GroupName = (SELECT UserJoinGroup.GroupName FROM UserJoinGroup WHERE UserJoinGroup.Username="${req.user.Username}"))`);
  console.log(user);
  let users = await getGeneralQuery(connection,`SELECT * FROM Groups,UserJoinGroup WHERE Groups.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.GroupName = "${group[0].GroupName}"`);
  let cves = await getGeneralQuery(connection,`SELECT * FROM Groups,UserJoinGroup,(SELECT Users.Username,CVE.CVEName,CVE.TimeCreation FROM Users,CVE WHERE Users.Username = CVE.CVEUserCreate ORDER BY CVE.TimeCreation DESC) AS t1 WHERE t1.Username = UserJoinGroup.Username AND UserJoinGroup.GroupName = Groups.GroupName AND Groups.GroupName = "${group[0].GroupName}"`)
  res.render("mygroup",{username:user,data:group[0],users:users,cves:cves})
})




module.exports = route;
