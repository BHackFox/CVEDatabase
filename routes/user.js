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
  let data = await getGeneralQuery(connection,`SELECT * FROM Users`)
  let user = false
  if (req.user){
    user = req.user.Username
  }
  res.render("cve",{username:user,cves:data})
})


route.get("/:user", async(req,res)=>{
  req.session.redirect = "/user/"+req.params.user
  let data = await getGeneralQuery(connection,`SELECT * FROM Users WHERE Username="${req.params.user}"`)
  if (data) {
    let user = false;
    if(req.user){
      user = req.user;
    }
    console.log(user,data);
    res.render("user",{username:user,dataobj:data[0]})
  }
})


module.exports = route;
