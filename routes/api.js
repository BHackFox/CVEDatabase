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
  let data = await getGeneralQuery(connection,`SELECT Email,Name,Surname FROM Users WHERE Username = "${user}"`);
  res.json(data[0]);
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
  console.log(req.body);
  await postGeneralQuery(connection,`INSERT INTO Tags(TagName,TagDescription) VALUES("${req.body.TagName}","${req.body.TagDescription}")`);
  res.json({response:true})
})


function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/login')
}

module.exports = route;
