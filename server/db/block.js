var db = require('../db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blockSchema = new Schema({
  username: String,
  topic: String,
  elapsed: Number,
  start: Number,
  end: Number
}, {timestamps: true});

var Block = db.model('Block', blockSchema);

module.exports = Block;

