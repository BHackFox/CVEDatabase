const express = require('express')
const route = express.Router()
const getUser = require('../mysql/GET/getUser');
const getGeneralQuery = require('../mysql/GET/getGeneralQuery');
const postGeneralQuery = require('../mysql/POST/postGeneralQuery');
const mysql = require('mysql');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
    host: "localhost",
    user: "fede",
    password: "fede",
    database: "CVEDatabase",
});
route.use(express.static('public'));
route.use(bodyParser.urlencoded({
    extended: true
}));
route.use(bodyParser.json());
route.use(express.json());


route.get("/",async(req,res)=>{
  let user = false;
  let hav = ""
  if (req.query.search) {
    hav = 'HAVING t1.TagName LIKE "%'+req.query.search+'%" OR TagDescription LIKE "%'+req.query.search+'%"';
  }
  if (req.user) {
    user = req.user;
  }
  let tags = await getGeneralQuery(connection,`SELECT Num, TagName, TagOS, TagLanguage, TagType, OSDescription, LanguageDescription FROM (SELECT t1.Num,t1.TagName,TagOS,TagLanguage,TagType,TagDescription FROM (SELECT COUNT(HasTags.TagName) AS Num,HasTags.TagName FROM Tags LEFT OUTER JOIN HasTags ON Tags.TagName=HasTags.TagName GROUP BY HasTags.TagName) AS t1, Tags WHERE t1.TagName=Tags.TagName ${hav}) AS t2 LEFT OUTER JOIN OSTag ON TagOS=OSName LEFT OUTER JOIN LanguageTag ON LanguageName=TagLanguage ORDER BY t2.Num DESC`);
  console.log(tags);
  res.render("tags",{username:user,tags:tags})
});

route.post("/newOSTag",(req,res)=>{
  postGeneralQuery(connection,`INSERT INTO OSTag(OSName, OSDescription) VALUES("${req.body.name}","${req.body.desc}")`)
  res.send("OK")
})

module.exports = route;
