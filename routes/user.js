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
  let data = await getGeneralQuery(connection,`SELECT count(*) AS NUM, Username FROM Users,CVE WHERE CVE.CVEUserCreate = Users.Username GROUP BY Users.Username ${hav} ORDER BY NUM DESC LIMIT 25`)
  let user = false
  console.log(data);
  if (req.user){
    user = req.user.Username
  }
  res.render("users",{username:user,users:data})
})


route.get("/:user", async(req,res)=>{
  req.session.redirect = "/user/"+req.params.user
  let data = await getGeneralQuery(connection,`SELECT * FROM Users WHERE Username="${req.params.user}"`)
  let cves = await getGeneralQuery(connection,`SELECT * FROM CVE WHERE CVEUserCreate="${req.params.user}" ORDER BY TimeCreation DESC`)
  if (data) {
    let user = false;
    if(req.user){
      user = req.user;
    }
    res.render("user",{username:user,dataobj:data[0],cves:cves})
  }
})


module.exports = route;
