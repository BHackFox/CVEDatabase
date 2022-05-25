const express = require('express')
const route = express.Router()
const mysql = require('mysql');
var bodyParser = require('body-parser');
var connection = mysql.createConnection({
    host: "localhost",
    user: "fede",
    password: "fede",
    database: "CVEDatabase",
});
const getUser = require('../mysql/GET/getUser');
const getGeneralQuery = require('../mysql/GET/getGeneralQuery');
const postGeneralQuery = require('../mysql/POST/postGeneralQuery');

route.use(express.static('public'));
route.use(bodyParser.urlencoded({
    extended: true
}));
route.use(bodyParser.json());
route.use(express.json());
route.get("/user/:user",async (req,res)=>{
  let user = req.params.user;
  let data = await getGeneralQuery(connection,`SELECT Email,Name,Surname FROM Users,Persona WHERE Users.Username=Persona.Username AND Users.Username = "${user}"`);
  res.json(data[0]);
})

route.post("/user/",checkAuthenticated,async(req,res)=>{
  let values = '';
  if (req.body.name) {
    values += ` Name = "${req.body.name}",`
  }
  if (req.body.surname) {
    values += ` Surname = "${req.body.surname}",`
  }
  if (req.body.mobile) {
    values += ` Mobile = "${req.body.mobile}",`
  }
  if (req.body.country) {
    values += ` Country = "${req.body.country}",`
  }
  if (req.body.city) {
    values += ` City = "${req.body.city}",`
  }
  if (req.body.address) {
    values += ` Address = "${req.body.address}",`
  }
  if (req.body.zip) {
    values += ` Zip = "${req.body.zip}",`
  }
  if (req.body.passport) {
    values += ` Passport = "${req.body.passport}",`
  }
  if (values !== '') {
    await postGeneralQuery(connection,`UPDATE Persona SET ${values} LastEdit=now() WHERE Username="${req.user.Username}"`);
  }
  res.json({response:true});
})

route.get("/tags",async(req,res)=>{
  let data = await getGeneralQuery(connection,`SELECT TagName,TagDescription FROM Tags`);
  res.json(data);
})

route.get("/tags/:tag",async(req,res)=>{
  let data = await getGeneralQuery(connection,`SELECT TagName,TagDescription FROM Tags WHERE TagName="${req.params.tag}"`);
  res.json(data)
})

route.post("/tags/newtag", checkAuthenticated,async(req,res)=>{
  console.log(req.body.TagName);
  let tag = await getGeneralQuery(connection,`SELECT TagName FROM Tags WHERE TagName="${req.body.TagName}"`);
  if (tag.length===0) {
    await postGeneralQuery(connection,`INSERT INTO Tags(TagName,TagDescription,TagOS,TagLanguage,TagType) VALUES("${req.body.TagName}","${req.body.TagDescription}","${req.body.TagOs}","${req.body.TagLanguage}","${req.body.TagType}")`);
  }
  res.json({response:true})
})

route.post("/premium",checkAuthenticated,async(req,res)=>{
  await postGeneralQuery(connection,`INSERT INTO UserPremium(Username,Card) VALUES("${req.user.Username}","${req.body.card}")`);
  res.redirect("/account");
})

function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}

module.exports = route;
