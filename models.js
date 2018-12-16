"use strict";

const mongoose = require("mongoose");

const User = require('./users/models');

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
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  activity: { type: String, required: true },
  location: { type: String, required: true },
  notes: String,
  time: { type: Date, default: Date.now() }
})

entriesSchema.methods.serialize = function () {
  return {
    id: this._id,
    user: this.user,
    activity: this.activity,
    location: this.location,
    notes: this.notes,
    time: this.time
    // time2: moment(this.time),
    // time3: moment(this.time).unix()
  }
}

const Entry = mongoose.model("Entry", entriesSchema);

module.exports = { Entry };



