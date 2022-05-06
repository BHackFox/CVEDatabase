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


route.get("/",(req,res)=>{

});

route.post("/newOSTag",(req,res)=>{
  postGeneralQuery(connection,`INSERT INTO OSTag(OSName, OSDescription) VALUES("${req.body.name}","${req.body.desc}")`)
  res.send("OK")
})

module.exports = route;
