var express = require('express');
// var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app = express();
// var port = 3000;
app.set('port', (process.env.PORT || 3000));
app.set('db', (process.env.DATABASE_URL || 'mongodb://localhost/vicara'))

// mongoose.connect(app.get('db'));

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

app.get('/', function(req, res) {
  res.render('index.html');
})


app.listen(app.get('port'));
console.log('Server now listening on port ' + app.get('port'));
