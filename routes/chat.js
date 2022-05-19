const express = require('express')
const route = express.Router()
const getUser = require('../mysql/GET/getUser');
const getGeneralQuery = require('../mysql/GET/getGeneralQuery');
const postGeneralQuery = require('../mysql/POST/postGeneralQuery');
const mysql = require('mysql');
const socket = require('socket.io');
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

route.get("/",(req,res)=>{
  req.session.redirect = "/chat";

  res.render("chat",{username:req.user});
});

// socket.io instance






module.exports = route;
