const express = require('express')
const route = express.Router()
const mysql = require('mysql');
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
  let groups = await getGeneralQuery(connection,`SELECT SUM(NUM) AS Sum_Users,t1.GroupName FROM (SELECT Groups.GroupName,Username FROM Groups,UserJoinGroup WHERE Groups.GroupName = UserJoinGroup.GroupName) AS t1 LEFT OUTER JOIN (SELECT count(CVEUserCreate) AS NUM, Username FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = Users.Username GROUP BY Users.Username) AS t2 ON t1.Username = t2.Username GROUP BY t1.GroupName`)
  res.send(groups);
})

route.post("/createGroup",async (req,res)=>{
  await postGeneralQuery(connection,`INSERT INTO UserJoinGroup(Username,GroupName,UserRole) VALUES("${req.user.Username}","${req.body.GroupName}","CREATOR")`)
  await postGeneralQuery(connection,`INSERT INTO Groups(GroupName,GroupDescription) VALUES("${req.body.GroupName}","A new Group was created!")`)
  res.redirect("/group")
})

route.get("/:group",async(req,res)=>{
  let group = await getGeneralQuery(connection,`SELECT * FROM Groups WHERE GroupName = "${req.params.group}"`);
  let users = await getGeneralQuery(connection,`SELECT * FROM Users,UserJoinGroup WHERE Users.Username = UserJoinGroup.Username AND UserJoinGroup.GroupName = "${req.params.group}"`);
  for (var i = 0; i < users.length; i++) {
    let user = await getGeneralQuery(connection,`SELECT * FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate=Users.Username WHERE Username="${users[i].Username}" ORDER BY TimeCreation DESC`)
    console.log(user);
  }
  var data = {group:group,users:users}
  res.send(data);
})


module.exports = route;
