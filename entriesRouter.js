const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Entry } = require('./models');
const passport = require('passport');

var jwt = require('jwt-simple');

const { JWT_SECRET } = require('./config');

const { User } = require('./users/models')

const jwtAuth = passport.authenticate('jwt', { session: false });

//GET all entries
router.get('/', jwtAuth, (req, res) => {
  let username = getUsernameFromJwt(req);
  User.findOne({ 'username': username })
    .then(user => {
      Entry.find({ 'userId': user.id })
        .then(entry => {
          res.json({
            entries: entry.map(entry => entry.serialize())
          });
        })
        .catch(err => {
          res.status(500).json({ message: "Internal server error" });
        });
    })
});

function getUsernameFromJwt(req) {
  let authHeaderString = JSON.stringify(req.headers.authorization);
  let jwtString = authHeaderString.split(' ')[1];
  let userPayload = jwt.decode(jwtString, JWT_SECRET, "HS256");
  let username = userPayload.user.username;
  return username;
};

//GET a single entry
router.get('/:id', jwtAuth, (req, res) => {
  Entry.findById(req.params.id)
    .then(entry => {
      res.json(entry)
    })
    .catch(err => {
      res.status(500).json({ message: "Internal server error" });
    });
});

router.post("/", jwtAuth, jsonParser, (req, res) => {
  const requiredFields = ["activity", "location"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      return res.status(400).send(message);
    };
  };

  let username = getUsernameFromJwt(req);
  User.findOne({ 'username': username })
    .then(username => {
      Entry.create({
        username: req.body.username,
        activity: req.body.activity,
        location: req.body.location,
        notes: req.body.notes,
        userId: username.id
      })
        .then(entry => res.status(201).json(entry))
        .catch(err => {
          // console.error(err);
          res.status(500).json({ message: "Internal server error" });
        });
    });
});

router.put("/:id", jwtAuth, jsonParser, (req, res) => {
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ["activity", "location", "notes"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Entry
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

router.delete("/:id", jwtAuth, (req, res) => {
  Entry.findByIdAndRemove(req.params.id)
    .then(post => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

module.exports = router;

