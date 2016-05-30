var express = require('express');
var app = express();
var data = require('./styleData.json');
var simulated_stats = require('./simulated_stats.json');
var ajax = require('superagent');

app.set('view engine', 'ejs');
app.use('/', express.static('public'));

function randomIntFromInterval(min,max) { return Math.floor(Math.random()*(max-min+1)+min); }

app.get('/', function (req, res) {
  console.log('GET --> /');
  res.render('index', { styleData: JSON.stringify(data) });
});

app.post('/actions/getstats.php', function (req, res) {
  console.log('POST --> /stats');
  simulated_stats.stats.points = randomIntFromInterval(0, 100);
  simulated_stats.stats.wins = randomIntFromInterval(0, 500);
  simulated_stats.stats.losses = randomIntFromInterval(0, 500);
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

var server = app.listen(3001, function () {
  var port = server.address().port;
  console.log("Server listening at http://localhost:%s", port);
})
