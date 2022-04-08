const express = require('express')
const route = express.Router()
const mysql = require('mysql');
var crypto = require('crypto');
var base64url = require('base64url');
var connection = mysql.createConnection({
    host: "localhost",
    user: "fede",
    password: "fede",
    database: "CVEDatabase",
});
const getGeneralQuery = require('../mysql/GET/getGeneralQuery');
const postGeneralQuery = require('../mysql/POST/postGeneralQuery');

route.use(express.static('public'))

route.get("/",async (req,res)=>{
  let hav = ""
  if (req.query.search) {
    hav = 'HAVING (t1.GroupName LIKE "%'+req.query.search+'%")'
  }
  let user = false;
  if (req.user) {
    user = req.user.Email;
  }
  let groups = await getGeneralQuery(connection,`SELECT SUM(NUM) AS Sum_Users,t1.GroupName FROM (SELECT Groups.GroupName,Username FROM Groups,UserJoinGroup WHERE Groups.GroupName = UserJoinGroup.GroupName) AS t1 LEFT OUTER JOIN (SELECT count(CVEUserCreate) AS NUM, Username FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = Users.Username GROUP BY Users.Username) AS t2 ON t1.Username = t2.Username GROUP BY t1.GroupName ${hav} ORDER BY Sum_Users DESC LIMIT 25`)
  res.render("groups",{username:user,groups:groups});
})

route.post("/createGroup",async (req,res)=>{
  let group = await getGeneralQuery(connection,`SELECT * FROM Groups,UserJoinGroup WHERE Groups.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.Username = "${req.user.Username}"`)
  if (!group[0]) {
    await postGeneralQuery(connection,`INSERT INTO UserJoinGroup(Username,GroupName,UserRole) VALUES("${req.user.Username}","${req.body.GroupName}","CREATOR")`)
    await postGeneralQuery(connection,`INSERT INTO Groups(GroupName,GroupDescription) VALUES("${req.body.GroupName}","A new Group was created!")`)
  }
  res.redirect("/group")
})

route.post("/inviteMember",async(req,res)=>{
  let data = {
    Username:req.body.username,
    GroupName:req.body.GroupName,
    InviteMember:req.body.InviteMember,
    UrlInvite: tokenCreate(20),
    UserRole: req.body.UserRole
  };
  await postGeneralQuery(connection,`INSERT INTO UserJoinGroup(Username,GroupName,InviteMember,UrlInvite,UserRole) VALUES("${data.Username}","${data.GroupName}","${data.InviteMember}","${data.UrlInvite}","${data.UserRole}")`);
  res.redirect("/account")
})

route.get("/:group",async(req,res)=>{
  //let users = `SELECT * FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate=Users.Username WHERE Username IN (SELECT * FROM Users,UserJoinGroup WHERE Users.Username = UserJoinGroup.Username AND UserJoinGroup.GroupName = "${req.params.group}") ORDER BY TimeCreation DESC`
  let group = await getGeneralQuery(connection,`SELECT * FROM Groups AS t1 WHERE t1.GroupName = "${req.params.group}"`);
  let cves = await getGeneralQuery(connection,`SELECT * FROM Groups,UserJoinGroup,(SELECT Users.Username,CVE.CVEName,CVE.TimeCreation FROM Users,CVE WHERE Users.Username = CVE.CVEUserCreate ORDER BY CVE.TimeCreation DESC) AS t1 WHERE t1.Username = UserJoinGroup.Username AND UserJoinGroup.GroupName = Groups.GroupName AND Groups.GroupName = "${req.params.group}"`);
  // let users = await getGeneralQuery(connection,`SELECT U.Username,U.UserTimeJoin,t3.NUM FROM UserJoinGroup AS U, Groups, (SELECT Groups.GroupName,UserJoinGroup.Username, NUM FROM Groups,UserJoinGroup,(SELECT COUNT(Users.Username) AS NUM,Users.Username FROM Users,CVE WHERE Users.Username = CVE.CVEUserCreate ORDER BY CVE.TimeCreation DESC) AS t1 WHERE t1.Username = UserJoinGroup.Username AND UserJoinGroup.GroupName = Groups.GroupName AND Groups.GroupName = "${req.params.group}" GROUP BY t1.Username) AS t3 WHERE U.Username = U.Username AND U.GroupName = Groups.GroupName AND Groups.GroupName = "${req.params.group}"`)
  let user = false;
  if (req.user) {
    user = req.user.Email;
  }
//  console.log(users);
  var data = {username:user,users:cves,group:group[0]}
  res.render("group",data);
})

function tokenCreate(n){
  return base64url(crypto.randomBytes(n));
}

module.exports = route;
