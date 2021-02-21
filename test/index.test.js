const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const server = require('../app');

chai.use(chaiHttp);

//Her describe içinde birden fazla it() olabilir.Bunların içinde test yapabiliriz.
describe('Node Server',() => {
   it('(GET/) anasayfayı döndürür',(done) => {
      chai.request(server)
          .get('/')
          .end((err,res)=>{
             res.should.have.status(200);
             done();
          });
       //done(); //done demek test bitti herşey yolunda.
   });
});