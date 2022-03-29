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

route.get("/",async (req,res)=>{
  let data = await getGeneralQuery(connection,`SELECT * FROM CVE`)
  let user = false
  if (req.user){
    user = req.user.Username
  }
  res.render("cve",{username:user,cves:data})
})

route.post("/newcve",checkAuthenticated,async (req,res)=>{
  let lol = "CVE_2022_03_29_23_48"
  postGeneralQuery(connection,`INSERT INTO CVE(CVEName, CVETitle, CVEDescription, CVEUserCreate) VALUES("${lol}","${req.body.CVETitle}","${req.body.CVEDescription}","${req.user.Username}")`)
  res.redirect("/CVE/")
})

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  console.log("AO");
  res.redirect('/login')
}

module.exports = route;
