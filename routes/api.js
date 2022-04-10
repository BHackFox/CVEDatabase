const express = require('express')
const route = express.Router()
const mysql = require('mysql');
var connection = mysql.createConnection({
    host: "localhost",
    user: "fede",
    password: "fede",
    database: "CVEDatabase",
});
const getUser = require('../mysql/GET/getUser');
const getGeneralQuery = require('../mysql/GET/getGeneralQuery');
const postGeneralQuery = require('../mysql/POST/postGeneralQuery');

route.use(express.static('public'))


route.get("/user/:user",async (req,res)=>{
  let user = req.params.user;
  let data = await getGeneralQuery(connection,`SELECT Email,Name,Surname FROM Users WHERE Username = "${user}" `);
  res.json(data[0]);
})





module.exports = route;
