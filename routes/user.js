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
  let data = await getGeneralQuery(connection,`SELECT count(*) AS NUM, Username FROM Users INNER JOIN CVE ON CVE.CVEUserCreate = Users.Username WHERE Users.Username LIKE "%${req.query.search}%" GROUP BY Users.Username ${hav} ORDER BY NUM DESC LIMIT 25`)
  let user = false

  // let data = await getGeneralQuery(connection,`SELECT count(*) AS NUM, Username FROM Users,CVE WHERE CVE.CVEUserCreate = Users.Username GROUP BY Users.Username ${hav} ORDER BY NUM DESC LIMIT 25`)
  // let user = false
  // if (!data[0]) {
  //   data = await getGeneralQuery(connection,`SELECT Username FROM Users WHERE Username LIKE "%${req.query.search}%" ORDER BY Username DESC LIMIT 25`)
  //   data[0].NUM = 0;
  // }
  if (req.user){
    user = req.user.Email
  }
  res.render("users",{username:user,users:data})
})


route.get("/:user", async(req,res)=>{
  req.session.redirect = "/user/"+req.params.user
  let data = await getGeneralQuery(connection,`SELECT * FROM CVE,Users WHERE CVEUserCreate="${req.params.user}" AND Username="${req.params.user}" ORDER BY TimeCreation DESC`);
  let user = false;
  if(req.user){
    user = req.user.Email;
  }
  console.log(user);
  if (data) {
    res.render("user",{username:user,dataobj:data[0],cves:data})
  }
  else {
    res.redirect("/user/")
  }
})


module.exports = route;
