var db = require('../db');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: String,
  password: String
}, {timestamps: true});

var User = db.model('User', userSchema);

module.exports = User;
