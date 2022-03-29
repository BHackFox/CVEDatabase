const express = require('express')
const route = express.Router()
const getUser = require('../mysql/GET/getUser');


route.get("/",(req,res)=>{
  res.send("OK")
})

module.exports = route;
