const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { BlogPosts } = require('./models');

//create some blog posts so there's something to look at
BlogPosts.create("Hello World", "This is the blog content", "Mark Yapp");
BlogPosts.create("Hello Universe", "This is the second blog post content", "Mark Yapp");

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
})

router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id);
  res.json(`Deleted blog post id: ${req.params.id}`);
});

router.post('/', jsonParser, (req, res) => {

  // ensure `title`, `content`, and 'author' are in the request body
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

router.put('/:id', jsonParser, (req, res) => {
  BlogPosts.update(req.body);
  res.send(`this will update post: ${req.body.id}`)
})

module.exports = router;

