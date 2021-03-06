const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/Users');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.post('/register', (req, res, next) => {
  const { username , password} = req.body;

  bcrypt.hash(password, 10).then(function(hash) {
    // Store hash in your password DB.
    const user = new User({
      username,
      password : hash
    });

    const promise = user.save();

    promise.then((data)=>{
      res.json(data);
    }).catch((err)=>{
      res.json(err);
    });
  });
});

router.post('/authenticate', (req, res) => {
  const { username, password } = req.body; //gelen kullanıcı bilgileri

  User.findOne({ //kullanıcıyı bulma
    username
  }, (err, user) => {
    if (err)
      throw err;

    if(!user){//kullanıcı yoksa
      res.json({
        status: false,
        message: 'Authentication failed, user not found.'
      });
    }else{
      bcrypt.compare(password, user.password).then((result) => {//şifre karşılaştırılması
        if (!result){//şifre uymuyorsa
          res.json({
            status: false,
            message: 'Authentication failed, wrong password.'
          });
        }else{
          const payload = {
            username
          };
          const token = jwt.sign(payload, req.app.get('api_secret_key'), {
            expiresIn: 720 // 12 saat
          });

          res.json({
            status: true,
            token
          })
        }
      });
    }
  });
});


module.exports = router;
