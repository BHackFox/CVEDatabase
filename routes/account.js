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


route.get("/",async (req,res)=>{
  req.session.redirect = "/account/"
  let user = req.user.Email;
  let account = await getUser(connection,`SELECT Username,Email,Name,Surname FROM Users WHERE Username = "${req.user.Username}"`);
  console.log(account);
  res.render("account",{username:user,data:account})
})




module.exports = route;
