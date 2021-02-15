const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Models
const Movie = require('../models/Movie');

//Top10 Listesi Yapma - get methoduyla çakışıyor :movie olan ile.Çakışmaması için bunu üste yazıyoruz.
router.get('/top10',(req,res) =>{
    const promise = Movie.find({}).limit(10).sort({imdb_score:-1});
    //-1 dediğimizde büyükten küçüğe doğru sıralar
    promise.then((data)=>{
        res.json(data);
    }).catch((err) =>{
        res.json(err);
    });
});

//Silme
router.delete('/:movie_id',(req,res,next)=>{
    const promise = Movie.findByIdAndRemove(req.params.movie_id);

    promise.then((movie) =>{
        if(!movie) //bu şekilde olduğu zaman 12 haneli id gönderilmeli.Eğer daha az veya çok olacaksa isValid
            //ile kontrol edilebilir.
            next({ message : 'The movie was not found',code:2 });
        res.json({ status : 1});
    }).catch((err)=>{
        res.json(err);
    });
});

//Güncelleme İşlemi
router.put('/:movie_id',(req,res,next)=>{
    const promise = Movie.findByIdAndUpdate(
        req.params.movie_id,
        req.body,
        {
            new : true // bunu yazdığımızda güncelleme sonrasında gelen data güncel olarak gelir.Yazmazsak eski data gelir
        }
    );

    promise.then((movie) =>{
        if(!movie) //bu şekilde olduğu zaman 12 haneli id gönderilmeli.Eğer daha az veya çok olacaksa isValid
            //ile kontrol edilebilir.
            next({ message : 'The movie was not found',code:2 });
        res.json(movie);
    }).catch((err)=>{
        res.json(err);
    });
});

//Bir movie getir
router.get('/:movie_id',(req,res,next)=>{
    const promise = Movie.findById(req.params.movie_id);
    const message = mongoose.Types.ObjectId.isValid(req.params.movie_id);
    if(!message)
        next({ message : 'ID 12 haneli değildir',code:1 });
    promise.then((movie) =>{
        if(!movie) //bu şekilde olduğu zaman 12 haneli id gönderilmeli.Eğer daha az veya çok olacaksa isValid
                //ile kontrol edilebilir.
                next({ message : 'The movie was not found',code:2 });
        res.json(movie);
    }).catch((err)=>{
        res.json(err);
    });
});

//Tüm Filmleri Listeleme
router.get('/',(req,res) =>{
    //normalde find kullanabiliriz.Ama filmin yönetmenini de getirmek için aggregate kullanıyoruz.
    const promise = Movie.aggregate([
        {
            $lookup : {
                from : 'directors',
                localField : 'director_id',
                foreignField : '_id',
                as : 'director'
            }
        },
        {
            $unwind : '$director'
        }
    ]);

    promise.then((data)=>{
       res.json(data);
    }).catch((err) =>{
       res.json(err);
    });
});

// Between
router.get('/between/:start_year/:end_year', (req, res) => {
    const { start_year, end_year } = req.params;
    //$gte büyük veya eşilt - $lte küçük veya eşit - $lt küçük - $gt büyük 
    const promise = Movie.find(
        {
            year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
        }
    );

    promise.then((data) => {
        res.json(data);
    }).catch((err) => {
        res.json(err);
    })
});

router.post('/', (req, res, next) => {
    const {title, imdb_score, category, country, year}=req.body;

    const movie = new Movie(req.body);
    //Atama Yöntemi
   /* const movie = new Movie({
       title:title,
       imdb_score:imdb_score,
       category:category,
       country:country,
        year:year
    });*/

    //arrow function
    /*movie.save((err,data)=>{
        if(err)
            res.json(err);
        res.json({status : 1});
    });*/

    //promise yapısı
    const promise = movie.save();
    promise.then((data)=>{
        res.json({status : 1});
    }).catch((err)=>{
        res.json(err);
    });


});

module.exports = router;
