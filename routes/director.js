const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Models
const Director = require('../models/Director');

//Yönetmen Ekleme
router.post('/',(req,res)=>{
   const director = new Director(req.body);
   const promise = director.save();

   promise.then((data) => {
       res.json(data);
   }).catch((err) => {
        res.json(err);
   });
});

//Top10
router.get('/top10',(req,res) => {
   const promise = Director.find({}).limit(10).sort({name : 1});

   promise.then((data) =>{
       res.json(data);
   }).catch((err) =>{
       res.json(err);
   })
});

//Yönetmen Silme
router.delete('/:director_id',(req,res,next)=> {
   const promise = Director.findByIdAndRemove(req.params.director_id);

   promise.then((director) => {
       if(!director)
           next({
               message : 'Director was not found',
               code : 5
           });
       res.json({ status : 1});
   }).catch((err)=>{
      res.json(err);
   });
});

//Yönetmen Güncelleme
router.put('/:director_id',(req,res,next) => {
    const promise = Director.findByIdAndUpdate(
      req.params.director_id,
      req.body,
        {
            new : true
        }
    );

    promise.then((director) => {
       if(!director)
           next({
              message : 'Director was not found',
              code : 4
           });
       res.json(director);
    }).catch((err) => {
        res.json(err);
    });
});

/*Bir Yönetmen Getirme
router.get('/:director_id',(req,res,next)=>{
   const promise = Director.findById(req.params.director_id);

   promise.then((director) => {
       if(!director)
           next({
              message : 'Director was not found',
              code : 3
           });
       res.json(director);
   }).catch((err) => {
       res.json(err);
   });
});*/

//Filmleriyle Birlikte Bir Yönetmen Getirme
router.get('/:director_id',(req,res)=>{
    const promise = Director.aggregate([
        {
            $match : {
                '_id' : mongoose.Types.ObjectId(req.params.director_id)
            }
        },
        {
            //Genel ayarlar - hangi tablodan,hangi sütun hangi sütunun yerini tutacak
            $lookup : {
                from : 'movies',
                localField : '_id',
                foreignField : 'director_id',
                as : 'movies'
            }
        },
        {
            $unwind : {
                path : '$movies',
                preserveNullAndEmptyArrays : true //filmi olmayan yönetmrnleri getirmek için yazılır
            }
        },
        {
            $group : {
                _id : {
                    _id : '$_id',
                    name : '$name',
                    surname : '$surname',
                    bio : '$bio'
                },
                movies: {
                    $push : '$movies' //Normalde yönetmenler altında bir film olarak gösteriliyordu.Yani her film
                    //için ayrı ayrı yönetmenler geliyordu.push ile birlikte bör yönetmen altında tüm filmleri geliyor
                }
            }
        },
        {
            $project : {
                _id : '$_id._id',
                name : '$_id.name',
                surname : '$_id.surname',
                movies : '$movies'

            }
        }
    ]);

    promise.then((data)=>{
        res.json(data);
    }).catch((err)=>{
        res.json(err);
    });
});

//Join işlemi - Director ve Movie arasında - Yönetmenleri Filmleriyle Listeleme
router.get('/',(req,res)=>{
   const promise = Director.aggregate([
       {
           //Genel ayarlar - hangi tablodan,hangi sütun hangi sütunun yerini tutacak
           $lookup : {
               from : 'movies',
               localField : '_id',
               foreignField : 'director_id',
               as : 'movies'
           }
       },
       {
           $unwind : {
               path : '$movies',
               preserveNullAndEmptyArrays : true //filmi olmayan yönetmrnleri getirmek için yazılır
           }
       },
       {
           $group : {
               _id : {
                   _id : '$_id',
                   name : '$name',
                   surname : '$surname',
                   bio : '$bio'
               },
               movies: {
                   $push : '$movies' //Normalde yönetmenler altında bir film olarak gösteriliyordu.Yani her film
                   //için ayrı ayrı yönetmenler geliyordu.push ile birlikte bör yönetmen altında tüm filmleri geliyor
               }
           }
       },
       {
           $project : {
               _id : '$_id._id',
               name : '$_id.name',
               surname : '$_id.surname',
               movies : '$movies'

           }
       }
   ]);

   promise.then((data)=>{
       res.json(data);
   }).catch((err)=>{
        res.json(err);
   });
});

module.exports = router;