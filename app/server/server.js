var express = require('express');
var app = express();
var data = require('./styleData.json');

app.set('view engine', 'ejs');
app.use('/', express.static('public'));

app.get('/', function (req, res) {
  console.log('GET --> /');
  res.render('index', { styleData: JSON.stringify(data) });
})

var server = app.listen(3000, function () {
  var port = server.address().port;
  console.log("Server listening at http://localhost:%s", port);
})
