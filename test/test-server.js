"use strict";

const chai = require("chai");
const chaiHttp = require("chai-http");
const faker = require("faker");
const mongoose = require("mongoose");

const expect = chai.expect;

const { Entry } = require("../models");
const { app, runServer, closeServer } = require("../server");
const { TEST_DATABASE_URL } = require("../config");

chai.use(chaiHttp);

function seedEntryData() {
  console.info("seeding blogpost data");
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push(generateEntryData());
  }
  return Entry.insertMany(seedData);
}

// used to generate data to put in db
function generateActivity() {
  const titles = [
    "Blog post 1",
    "Blogpost 2",
    "Blogpost 3",
    "4th post",
    "Blogpost 5"
  ];
  return titles[Math.floor(Math.random() * titles.length)];
}

function generateEntryData() {
  return {
    activity: generateActivity(),
    location: generateActivity(),
    notes: faker.lorem.text()
  };
}

function tearDownDb() {
  console.warn("Deleting database");
  return mongoose.connection.dropDatabase();
}

describe("Blogpost API resource", function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedEntryData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe("GET endpoint", function() {
    it("should return all entries for testuser", function() {
      let res;
      return chai
        .request(app)
        .get("/entries")
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(401);
        });
    });
  });
});

//beforeEach, set a global token
