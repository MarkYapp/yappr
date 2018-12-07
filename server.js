
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


const app = express();



// log the http layer
app.use(morgan('common'));
app.use(express.static('public'));


// Seed some data
const { Entries } = require('./models.js');
Entries.create(
  'New York', ['Great Deli', 'In the van', 'Would definately go back here']);
Entries.create(
  'Los Angeles', ['American Diner', 'At a friends house', 'Hard to stealth camp, would not recommend']);

app.get("/entries", (req, res) => {
  console.log('sending the entries');
  res.json(Entries.get());
});

app.post("/entries", jsonParser, (req, res) => {
  console.log(req.body);
  const entry = Entries.create(req.body.location, req.body.details)
  res.status(201).json(entry);
});


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

if (require.main === module) {
  app.listen(process.env.PORT || 8080, function () {
    console.info(`App listening on ${this.address().port}`);
  });
}

module.exports = app;