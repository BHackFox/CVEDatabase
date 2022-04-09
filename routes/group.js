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
    user = req.user;
  }
  let groups = await getGeneralQuery(connection,`SELECT SUM(NUM) AS Sum_Users,t1.GroupName,COUNT(t1.Username) AS N_Users FROM (SELECT Grps.GroupName,Username FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName) AS t1 LEFT OUTER JOIN (SELECT count(CVEUserCreate) AS NUM, Username FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = Users.Username GROUP BY Users.Username) AS t2 ON t1.Username = t2.Username GROUP BY t1.GroupName ${hav} ORDER BY Sum_Users DESC LIMIT 25`)
  res.render("groups",{username:user,groups:groups});
})

route.post("/createGroup",async (req,res)=>{
  let group = await getGeneralQuery(connection,`SELECT * FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.Username = "${req.user.Username}"`)
  if (!group[0]) {
    await postGeneralQuery(connection,`INSERT INTO UserJoinGroup(Username,GroupName,UserRole) VALUES("${req.user.Username}","${req.body.GroupName}","CREATOR")`)
    await postGeneralQuery(connection,`INSERT INTO Grps(GroupName,GroupDescription) VALUES("${req.body.GroupName}","A new Group was created!")`)
  }
  res.redirect("/group")
})

route.post("/groupJoin",async(req,res)=>{
  let data = {
    Username:req.body.username,
    GroupName:req.body.GroupName,
    UserRole: req.body.UserRole
  };
  await postGeneralQuery(connection,`INSERT INTO UserJoinGroup(Username,GroupName,UserRole) VALUES("${data.Username}","${data.GroupName}","${data.UserRole}")`);
  await postGeneralQuery(connection,`UPDATE InviteInGroup SET Used=1 WHERE UrlInvite="${req.body.UrlInvite}"`);
  res.redirect(req.session.redirect)
})


route.post("/invite",async(req,res)=>{
  let data = {
    Username:req.body.username,
    GroupName:req.body.GroupName,
    InviteMember:req.user.Username,
    UrlInvite: tokenCreate(20),
    UserRole: req.body.UserRole
  };
  console.log(data);
  await postGeneralQuery(connection,`INSERT INTO InviteInGroup(Username,GroupName,InviteMember,UrlInvite,UserRole) VALUES("${data.Username}","${data.GroupName}","${data.InviteMember}","${data.UrlInvite}","${data.UserRole}")`);
  res.redirect("/account")
})

route.get("/:group",async(req,res)=>{
  //let users = `SELECT * FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate=Users.Username WHERE Username IN (SELECT * FROM Users,UserJoinGroup WHERE Users.Username = UserJoinGroup.Username AND UserJoinGroup.GroupName = "${req.params.group}") ORDER BY TimeCreation DESC`
  let group = await getGeneralQuery(connection,`SELECT SUM(NUM) AS Sum_Users,t1.GroupName,t1.GroupDescription, COUNT(t1.Username) AS N_Users FROM (SELECT Grps.GroupName,Username,Grps.GroupDescription FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName) AS t1 LEFT OUTER JOIN (SELECT count(CVEUserCreate) AS NUM, Username FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = Users.Username GROUP BY Users.Username) AS t2 ON t1.Username = t2.Username GROUP BY t1.GroupName,t1.GroupDescription HAVING t1.GroupName = "${req.params.group}"`);
  let users = await getGeneralQuery(connection,`SELECT t2.Username, t2.NUM, t3.UserRole, t3.UserTimeJoin FROM (SELECT t1.Username,COUNT(CVE.CVEUserCreate) AS NUM FROM (SELECT UserJoinGroup.Username,UserJoinGroup.UserRole,UserJoinGroup.UserTimeJoin FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.GroupName = "${req.params.group}") AS t1 LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = t1.Username GROUP BY t1.Username) AS t2,UserJoinGroup AS t3 WHERE t3.Username = t2.Username ORDER BY t3.UserTimeJoin`);

  let lim = `LIMIT 10`;
  if (req.query.view && req.query.view > 1 && req.query.view < 100) {
    lim = `LIMIT ${req.query.view}`;
  }
  else if (req.query.view && req.query.view == "all") {
    lim = "";
  }
  let cves = await getGeneralQuery(connection,`SELECT * FROM Grps,UserJoinGroup,(SELECT Users.Username,CVE.CVEName,CVE.TimeCreation FROM Users,CVE WHERE Users.Username = CVE.CVEUserCreate ORDER BY CVE.TimeCreation DESC) AS t1 WHERE t1.Username = UserJoinGroup.Username AND UserJoinGroup.GroupName = Grps.GroupName AND Grps.GroupName = "${req.params.group}" ORDER BY t1.TimeCreation DESC ${lim}`)
  let user = false;
  if (req.user) {
    user = req.user;
  }
//  console.log(users);
  var data = {username:user,cves:cves,users:users,data:group[0]}
  res.render("group",data);
})

function tokenCreate(n){
  return base64url(crypto.randomBytes(n));
}

module.exports = route;
