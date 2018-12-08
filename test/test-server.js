const chai = require('chai');
const chaiHttp = require('chai-http');


const app = require('../server');

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);

describe('Root URL', function () {
  it('should get a 200 response', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });
});