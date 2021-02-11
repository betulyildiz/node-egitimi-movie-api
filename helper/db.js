const mongoose = require('mongoose');

module.exports = () => {
    mongoose.connect('mongodb+srv://user-deneme:tr16kp262@movie-cluster.wa1lz.mongodb.net/movie-cluster?retryWrites=true&w=majority')

    mongoose.connection.on('open',() => {
        console.log('MongoDB : Connected');
    });

    mongoose.connection.on('error',(err) => {
        console.log('MongoDB : Error',err);
    });

    mongoose.Promise = global.Promise;

};