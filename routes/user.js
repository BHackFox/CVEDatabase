const express = require('express')
const route = express.Router()
const getUser = require('../mysql/GET/getUser');
const getGeneralQuery = require('../mysql/GET/getGeneralQuery');
const postGeneralQuery = require('../mysql/POST/postGeneralQuery');
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "fede",
    password: "fede",
    database: "CVEDatabase",
});
route.use(express.static('public'))


route.get("/",async (req,res)=>{
  req.session.redirect = "/user/";
  var hav = ""
  if(req.query.search){
    hav = 'HAVING (Users.Username LIKE "%'+req.query.search+'%")'
  }
  let data = await getGeneralQuery(connection,`SELECT count(CVEUserCreate) AS NUM, Username FROM Users LEFT OUTER JOIN CVE ON CVE.CVEUserCreate = Users.Username GROUP BY Users.Username ${hav} ORDER BY NUM DESC LIMIT 100`)
  let user = false

  // let data = await getGeneralQuery(connection,`SELECT count(*) AS NUM, Username FROM Users,CVE WHERE CVE.CVEUserCreate = Users.Username GROUP BY Users.Username ${hav} ORDER BY NUM DESC LIMIT 25`)
  // let user = false
  // if (!data[0]) {
  //   data = await getGeneralQuery(connection,`SELECT Username FROM Users WHERE Username LIKE "%${req.query.search}%" ORDER BY Username DESC LIMIT 25`)
  //   data[0].NUM = 0;
  // }
  if (req.user){
    user = req.user;
  }
  res.render("users",{username:user,users:data})
})


route.get("/:user", async(req,res)=>{
  req.session.redirect = "/user/"+req.params.user
  let data = await getGeneralQuery(connection,`SELECT * FROM (SELECT Users.Username, Users.Email, Persona.Name, Persona.Surname FROM Users, Persona WHERE Users.Username=Persona.Username) AS t1 LEFT OUTER JOIN CVE ON CVEUserCreate=t1.Username WHERE t1.Username="${req.params.user}" ORDER BY TimeCreation DESC`);
  let group = await getGeneralQuery(connection,`SELECT UserJoinGroup.GroupName FROM UserJoinGroup WHERE UserJoinGroup.Username="${req.params.user}"`)
  let user = false;
  if(req.user){
    user = req.user;
  }
  if (data[0]) {
    res.render("user",{username:user,dataobj:data[0],cves:data,group:group[0]})
  }
  else {
    res.redirect("/user/")
  }
})


module.exports = route;
