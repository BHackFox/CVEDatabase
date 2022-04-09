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
  req.session.redirect = "/CVE/";
  let n = 0;
  let search = ""
  let qs = ""
  if (req.query.search){
    qs = '?search='+req.query.search
    search = 'AND (CVEName LIKE "%'+req.query.search+'%" OR CVETitle LIKE "%'+req.query.search+'%")'
  }
  if (req.query.row<=0) {
    res.redirect("/CVE/"+qs)
  }
  else {
    if (req.query.row){
      n = req.query.row;
    }
    var query = `SELECT * FROM CVE WHERE (id>(SELECT MAX(id) FROM CVE)-${n+20} AND id<=(SELECT MAX(id) FROM CVE)-${n} ${search}) ORDER BY TimeCreation DESC LIMIT 20`
    let data = await getGeneralQuery(connection,query)
    let user = false
    if (req.user){
      user = req.user;
    }
    res.render("cves",{username:user,cves:data})
  }
})

route.post("/newcve",checkAuthenticated,async (req,res)=>{
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  if (month<10) month = '0'+month
  let day = date.getDate()
  if (day<10) day = '0'+day
  let hours = date.getHours()
  if (hours<10) hours = '0'+hours
  let minute = date.getMinutes()
  if (minute<10) minute = '0'+minute
  let second = date.getSeconds()
  if (second<10) second = '0'+second

  let lol = `CVE_${year}${month}${day}_${hours}${minute}${second}`
  let number_of_cve = await getGeneralQuery(connection,`SELECT COUNT(CVEName) AS N_CVE FROM CVE WHERE CVEName LIKE "${lol}%"`)
  if (number_of_cve[0].N_CVE > 0){
    lol = lol + "-"+String(number_of_cve[0].N_CVE+1);
  }
  postGeneralQuery(connection,`INSERT INTO CVE(CVEName, CVETitle, CVEDescription, CVEUserCreate) VALUES("${lol}","${req.body.CVETitle}","${req.body.CVEDescription}","${req.user.Username}")`)
  res.redirect("/CVE/")
})


route.get("/:CVE", async(req,res)=>{
  req.session.redirect = "/CVE/"+req.params.CVE;
  let data = await getGeneralQuery(connection,`SELECT * FROM CVE WHERE CVEName="${req.params.CVE}"`)
  if (data) {
    let user = false
    if (req.user){
      user = req.user;
    }
    console.log(data);
    res.render("cve",{username:user,data:data[0]})
  }
  else {
    res.redirect("/CVE/")
  }
})

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}

module.exports = route;
