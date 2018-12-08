const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

//import models
const { Entries } = require('./models.js');

// Seed some data
Entries.create(
  'New York', ['Great Deli', 'In the van', 'Would definately go back here']);
Entries.create(
  'Los Angeles', ['American Diner', 'At a friends house', 'Hard to stealth camp, would not recommend']);

//CRUD routes
router.get('/', (req, res) => {
  console.log('sending the entries list');
  res.json(Entries.get());
});

router.post('/', (req, res) => {
  // ensure `place`in the request body
  const requiredFields = ['title', 'content', 'author'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(post);
});

router.post("/entries", jsonParser, (req, res) => {
  console.log(req.body);
  const entry = Entries.create(req.body.location, req.body.details)
  res.status(201).json(entry);
});

router.put('/:id', jsonParser, (req, res) => {
  //put code to work with data
  //   Model.create()

  // .update

  BlogPosts.update(req.body);
  res.send(`this will update post: ${req.body.id}`)
})

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  res.json(`Deleted blog post id: ${req.params.id}`);
});

module.exports = router;

