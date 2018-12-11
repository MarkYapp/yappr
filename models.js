"use strict";

const mongoose = require("mongoose");

//feedback on mongoose connection
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected');
});
mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

const entriesSchema = mongoose.Schema({

  activity: { type: String, required: true },
  location: { type: String, required: true },
  notes: String
})

// entrySchema.methods.serialize = function () {
//   return {
//     author: this.author.firstName + ' ' + this.author.lastName,
//     title: this.title,
//     content: this.content
//   }
// }

const Entry = mongoose.model("Entry", entriesSchema);

module.exports = { Entry };



