const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

chai.use(chaiHttp);
let token,movieId;



//Her descrip içinde birden fazla it() olabilir.Bunların içinde test yapabiliriz.
//before fonk. ile testler başlamadan işlem yapabiliyoruz.
describe('/api/movies tests',() => {
    before((done) =>{
        //console.log('testten önce');
        chai.request(server)
            .post('/authenticate')
            .send({username:'beha',password:'tr16kp262'})
            .end((err,res) => {
               token=res.body.token;
               console.log(token);
               done();
            });
    });

    describe('/GET movies',()=>{
        it('it should GET all movies',(done)=>{
            chai.request(server)
                .get('/api/movies')
                .set('x-access-token',token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('/POST movie',()=>{
       it('it should POST a movie',(done)=>{
           const movie = {
               title : 'udemy',
               director_id : '6024d308f83f4255ccc6a4c4',
               category : 'comedy',
               country : 'Turkey',
               year : 1950,
               imdb_score : 8
           };
            chai.request(server)
                .post('/api/movies')
                .send(movie)
                .set('x-access-token',token)
                .end((err,res)=>{
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('title');
                    res.body.should.have.property('director_id');
                    res.body.should.have.property('category');
                    res.body.should.have.property('country');
                    res.body.should.have.property('year');
                    res.body.should.have.property('imdb_score');
                    movieId = res.body._id;

                    done();
                });
       });
    });

    describe('/GET/:movie_id movie',()=>{
    it('it should GET a movie by the given ID',(done)=>{
       chai.request(server)
           .get('/api/movies/'+movieId)
           .set('x-access-token',token)
           .end((err,res) => {
               res.should.have.status(200);
               res.body.should.be.a('object');
               res.body.should.have.property('title');
               res.body.should.have.property('director_id');
               res.body.should.have.property('category');
               res.body.should.have.property('country');
               res.body.should.have.property('year');
               res.body.should.have.property('imdb_score');
               res.body.should.have.property('_id').eql(movieId);
               done();
           });
    });
    });

    describe('/PUT/:movie_id movie',() => {
        it('it should UPDATE a movie given by ID',(done) => {
            const movie = {
                title : 'udemy2',
                director_id : '6024d308f83f4255ccc6a4c4',
                category : 'comedy2',
                country : 'Turkey2',
                year : 1950,
                imdb_score : 2
            };

          chai.request(server)
              .put('/api/movies/'+movieId)
              .send(movie)
              .set('x-access-token',token)
              .end((err,res)=>{
                  res.should.have.status(200);
                  res.body.should.be.a('object');
                  res.body.should.have.property('title').eql(movie.title);
                  res.body.should.have.property('director_id').eql(movie.director_id);
                  res.body.should.have.property('category').eql(movie.category);
                  res.body.should.have.property('country').eql(movie.country);
                  res.body.should.have.property('year').eql(movie.year);
                  res.body.should.have.property('imdb_score').eql(movie.imdb_score);
                  done();

              })
        });
    });

    describe('/DELETE/:movie_id movie',()=>{
       it('it should DELETE a movie by given ID',(done)=>{
        chai.request(server)
            .delete('/api/movies/'+movieId)
            .set('x-access-token',token)
            .end((err,res)=>{
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status').eql(1);
                done();

            })
       });
    });
});