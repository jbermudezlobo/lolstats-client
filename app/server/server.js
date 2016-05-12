var express = require('express');
var app = express();
var data = require('./styleData.json');
var simulated_stats = require('./simulated_stats.json');
var ajax = require('superagent');

app.set('view engine', 'ejs');
app.use('/', express.static('public'));

app.get('/', function (req, res) {
  console.log('GET --> /');
  res.render('index', { styleData: JSON.stringify(data) });
});

app.get('/stats', function (req, res) {
  console.log('GET --> /stats');
  res.json(simulated_stats);
});

app.get('/stats/:server/:summonername/:apikey', function (req, res) {
  console.log('GET --> /stats');

  var url = 'https://'+req.params.server+'.api.pvp.net/api/lol/'+req.params.server+'/v1.4/summoner/by-name/'+req.params.summonername+'?api_key='+req.params.apikey;

  ajax
    .get(url)
    .set('Accept', 'application/json')
    .set('Content-type', 'application/json')
    .end(function (err, data) {
      console.log(data.body);
      res.json(data.body);
    });

})

var server = app.listen(2000, function () {
  var port = server.address().port;
  console.log("Server listening at http://localhost:%s", port);
})
