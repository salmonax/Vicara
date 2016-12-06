var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var host = (process.env.DATABASE_URL || 'mongodb://localhost/vicara');

var db = mongoose.createConnection(host);

module.exports = db;