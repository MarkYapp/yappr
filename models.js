"use strict";

const mongoose = require("mongoose");

const { User } = require('./users/models');

const moment = require('moment');

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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  activity: { type: String, required: true },
  location: { type: String, required: true },
  notes: String,
  date: { type: Date, default: Date.now() }
})

entriesSchema.methods.serialize = function () {
  return {
    id: this._id,
    userId: this.userId,
    activity: this.activity,
    location: this.location,
    notes: this.notes,
    userDate: moment(this.date).format('lll')
  }
}

const Entry = mongoose.model("Entry", entriesSchema);

module.exports = { Entry };



