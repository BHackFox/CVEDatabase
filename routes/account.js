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

route.get("/",async (req,res)=>{
  let account = await getUser(connection,`SELECT Username,Name,Surname FROM Users WHERE Username = "${req.user.Username}"`);
  res.send(account)
})




module.exports = route;
