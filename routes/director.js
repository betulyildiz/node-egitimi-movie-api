const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Models
const Director = require('../models/Director');

router.get('/',(req,res)=>{
   res.json('Express');
});

router.post('/',(req,res)=>{
   const director = new Director(req.body);
   const promise = director.save();

   promise.then((data) => {
       res.json(data);
   }).catch((err) => {
        res.json(err);
   });
});

module.exports = router;