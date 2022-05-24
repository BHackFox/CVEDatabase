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
  let user = req.user;
  let data = await getGeneralQuery(connection,`SELECT * FROM (SELECT Users.Username,Email,Name,Surname,Mobile,Country,City,Address,Zip,Password FROM Users,Persona WHERE Users.Username=Persona.Username) AS t1 LEFT OUTER JOIN CVE ON CVE.CVEUserCreate=t1.Username WHERE t1.Username="${req.user.Username}" ORDER BY TimeCreation DESC`);
  let group = await getGeneralQuery(connection,`SELECT * FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.Username = "${req.user.Username}"`);
  let invites = await getGeneralQuery(connection,`SELECT GroupName,UserRole,UrlInvite FROM InviteInGroup WHERE Username="${req.user.Username}" AND Used=0`);
  res.render("account",{username:user,data:data[0],cves:data,group:group[0],invites:invites})
})

route.get("/group",async(req,res)=>{
  let user = req.user;
  let group = await getGeneralQuery(connection,`SELECT SUM(NUM) AS Sum_Users,t1.GroupName,t1.GroupDescription, COUNT(t1.Username) AS N_Users FROM (SELECT Grps.GroupName,Username,Grps.GroupDescription FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName) AS t1 LEFT OUTER JOIN (SELECT count(CVEUserCreate) AS NUM, Username FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = Users.Username GROUP BY Users.Username) AS t2 ON t1.Username = t2.Username GROUP BY t1.GroupName,t1.GroupDescription HAVING (t1.GroupName = (SELECT UserJoinGroup.GroupName FROM UserJoinGroup WHERE UserJoinGroup.Username="${req.user.Username}"))`);
  let badges = await getGeneralQuery(connection,`SELECT * FROM (SELECT COUNT(Badges.BadgeName) AS CB,Badges.BadgeName FROM Badges,HasBadge WHERE HasBadge.GroupName = "${group[0].GroupName}" AND HasBadge.BadgeName = Badges.BadgeName GROUP BY BadgeName) AS t1, Badges WHERE t1.BadgeName = Badges.BadgeName`)

  let users = await getGeneralQuery(connection,`SELECT t2.Username, t2.NUM, t3.UserRole, t3.UserTimeJoin FROM (SELECT t1.Username,COUNT(CVE.CVEUserCreate) AS NUM FROM (SELECT UserJoinGroup.Username,UserJoinGroup.UserRole,UserJoinGroup.UserTimeJoin FROM Grps,UserJoinGroup WHERE Grps.GroupName = UserJoinGroup.GroupName AND UserJoinGroup.GroupName = "${group[0].GroupName}") AS t1 LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = t1.Username GROUP BY t1.Username) AS t2,UserJoinGroup AS t3 WHERE t3.Username = t2.Username ORDER BY t3.UserTimeJoin`);

  let events = await getGeneralQuery(connection,`SELECT * FROM GroupEvents,UserJoinGroup WHERE GroupEvents.EventUser = UserJoinGroup.Username AND UserJoinGroup.GroupName = "${group[0].GroupName}" AND GroupEvents.EventTime +1 > UserJoinGroup.UserTimeJoin`)
  let lim = `LIMIT 10`;
  if (req.query.view && req.query.view > 1 && req.query.view < 100) {
    lim = `LIMIT ${req.query.view}`;
  }
  else if (req.query.view && req.query.view == "all") {
    lim = "";
  }
  let cves = await getGeneralQuery(connection,`SELECT * FROM Grps,UserJoinGroup,(SELECT Users.Username,CVE.CVEName,CVE.TimeCreation FROM Users,CVE WHERE Users.Username = CVE.CVEUserCreate ORDER BY CVE.TimeCreation DESC) AS t1 WHERE t1.Username = UserJoinGroup.Username AND UserJoinGroup.GroupName = Grps.GroupName AND Grps.GroupName = "${group[0].GroupName}" ORDER BY t1.TimeCreation DESC ${lim}`)
  res.render("mygroup",{username:user,data:group[0],users:users,cves:cves,badges:badges,events:events})
})


route.get("/newCVE",async(req,res)=>{
  let user = req.user;
  let ostags = await getGeneralQuery(connection,`SELECT OSName FROM OSTag`);
  let langtag = await getGeneralQuery(connection,`SELECT LanguageName FROM LanguageTag`);
  res.render("newcve",{username:user,ostags:ostags,langtag:langtag});
})



module.exports = route;
