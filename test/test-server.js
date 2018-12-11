const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require("../server");

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);

describe("Test endpoints", function () {
  before(function () {
    return runServer();
  });

  after(function () {
    return closeServer();
  });

  it('should get a 200 response', function () {
    return chai.request(app)
      .get('/')
      .then(function (res) {
        expect(res).to.have.status(200);
      });
  });
});