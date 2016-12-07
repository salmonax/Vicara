var express = require('express');
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();

var db = require('./db');
var User = require('./db/user');
var Block = require('./db/block');


app.set('port', (process.env.PORT || 3000));

// mongoose.connect(app.get('db'));

// app.get('/', function(req, res) {
//   res.render('index2.html');
// });

app.use(bodyParser.json());
// console.log(__dirname + '/public');
app.use(express.static(__dirname + '/../client'));

// console.log(__dirname + '/public');
app.set('views',__dirname + '/../client')
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.get('/login', function(req, res) {
  res.send('login code go heres');
});

app.get('/logout', function(req, res) {
  res.send('logout code go heres');
});


app.get('/db_post', function(req, res, next) {
  var elapsed = Math.floor(Math.random()*100000);
  var newBlock = new Block({
    username: "TestUser",
    topic: "Flying Around",
    elapsed: elapsed,
    start: Date.now()-elapsed,
    end: Date.now()
  });
  newBlock.save().then(function(newBlock) {
    console.log('POSTED: ', newBlock);
    res.json(newBlock);
  }).catch(function(err) {
    next(err);
  });
  
});

app.get('/db', function(req, res, next) {
  Block.find().then(function(blocks) {
    res.json(blocks);
  })
  .catch(function(err) {
    next(err);
  })

});




app.listen(app.get('port'));
console.log('Server now listening on port ' + app.get('port'));
