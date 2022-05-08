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
    var query = `SELECT CVE.CVEName,CVE.CVEUserCreate,CVE.TimeCreation,CVE.CVEConfermation,CVE.CVETitle,CVE.CVEDescription FROM CVE WHERE (CVE.id>(SELECT MAX(CVE.id) FROM CVE)-${n+20} AND CVE.id<=(SELECT MAX(CVE.id) FROM CVE)-${n} ${search}) ORDER BY TimeCreation DESC LIMIT 20`
    let data = await getGeneralQuery(connection,query)
    for (var i = 0; i < data.length; i++) {
      let tags = await getGeneralQuery(connection,`SELECT TagName FROM HasTags WHERE CVEName="${data[i].CVEName}"`)
      data[i].tags = tags;
    }
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
  for (var i = 0; i < req.body.tags.length; i++) {
    postGeneralQuery(connection,`INSERT INTO HasTags(TagName,CVEName,Username) VALUES("${req.body.tags[i]}","${lol}","${req.user.Username}")`)
  }
  res.redirect("/CVE/"+lol);
})


route.get("/:CVE", async(req,res)=>{
  req.session.redirect = "/CVE/"+req.params.CVE;
  let data = await getGeneralQuery(connection,`SELECT * FROM CVE WHERE CVEName="${req.params.CVE}"`)
  let tags = await getGeneralQuery(connection,`SELECT HasTags.TagName,Tags.TagDescription FROM HasTags,Tags WHERE CVEName="${req.params.CVE}" AND HasTags.TagName=Tags.TagName`)
  if (data) {
    let user = false
    if (req.user){
      user = req.user;
    }
    res.render("cve",{username:user,data:data[0],tags:tags})
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
