var express = require("express");
var app = express();
var port = process.env.PORT || 3700;
var io = require('socket.io').listen(app.listen(port));
var Instagram = require('instagram-node-lib');
var http = require('http');
var https = require('https');
var request = require('request');
var lastUpdate = 0;

var pg = require('pg');
var dburl = "postgres://ezmutynhgyvwis:3iU5A11f1z85h_W0VdkvV5LBr8@ec2-23-23-210-37.compute-1.amazonaws.com:5432/d5j3f1u3bib3th";

pg.connect(dburl, function(err, client, done) {
    client.query('create table instagram (data text)', function(err, result) {
        done();
        if(err) return console.error(err);
        console.log(result.rows);
    });
});

var pub = __dirname + '/public';
var view = __dirname + '/views';
var analytics = __dirname + '/analytics';

var clientID = '2672575357f04c2aa89358dc2e02b940';
var clientSecret = '7bd7de4197b0436f8e8a3faaccf6e6a1';

Instagram.set('client_id', clientID);
Instagram.set('client_secret', clientSecret);
Instagram.set('callback_url', 'http://instabasic.herokuapp.com/callback');
Instagram.set('redirect_uri', 'http://instabasic.herokuapp.com');
Instagram.set('maxSockets', 10);

Instagram.subscriptions.subscribe({
    object: 'tag',
    object_id: 'selfie',
    aspect: 'media',
    callback_url: 'http://instabasic.herokuapp.com/callback',
    type: 'subscription',
    id: '#'
});

Instagram.subscriptions.subscribe({
    object: 'tag',
    object_id: 'brunch',
    aspect: 'media',
    callback_url: 'http://instabasic.herokuapp.com/callback',
    type: 'subscription',
    id: '#'
});

Instagram.subscriptions.subscribe({
    object: 'tag',
    object_id: 'nofilter',
    aspect: 'media',
    callback_url: 'http://instabasic.herokuapp.com/callback',
    type: 'subscription',
    id: '#'
});

Instagram.subscriptions.subscribe({
    object: 'tag',
    object_id: 'starbucks',
    aspect: 'media',
    callback_url: 'http://instabasic.herokuapp.com/callback',
    type: 'subscription',
    id: '#'
});

Instagram.subscriptions.unsubscribe({ id: '#####' });

// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {
    io.set("transports", [
        'websocket',
        'xhr-polling',
        'flashsocket',
        'htmlfile',
        'jsonp-polling'
    ]);
    io.set("polling duration", 10);
});

app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(pub));
    app.use(express.static(view));
    app.use(express.static(analytics));
    app.use(express.errorHandler());
});

app.get("/views", function(req, res){
    res.render("index");
});

io.sockets.on('connection', function (socket) {
    Instagram.tags.recent({
        name: 'selfie',
        complete: function(data) {
            //console.log(data);
            socket.emit('firstShow', { firstShow: data });
        }
    });
});

app.get('/callback', function(req, res){
    var handshake = Instagram.subscriptions.handshake(req, res);
});

app.post('/callback', function(req, res) {
    var update = req.body[0];
    res.json({success: true, kind: update.object});

    if (update.time - lastUpdate < 1) return;
    lastUpdate = update.time;
    
    /*for later
    pg.connect(dburl, function(err, client, done){
      var query = "SELECT SUM(pgClass.reltuples) AS totalRowCount FROM pg_class pgClass "
                  + "LEFT JOIN pg_namespace pgNamespace ON "
                  + "(pgNamespace.oid = pgClass.relnamespace) "
                  + "WHERE pgNamespace.nspname NOT IN "
                  + "('pg_catalog', 'information_schema') AND pgClass.relkind='r';"
      client.query(query, function(err, result){
      	
      	query.on('row', function(row){
      	  console.log(row)
      	  if (row >= 9000){
      	    client.query('delete from instagram where data in (select * from instagram limit 1000);');
      	  }
      	});
      });
    });*/
  
    var data = req.body;
    data.forEach(function(tag) {
        var url = 'https://api.instagram.com/v1/tags/' + tag.object_id + '/media/recent?client_id='+clientID;
        console.log('this is the url for a specific tag.');
        console.log(url);
        sendMessage(url);
        
        //Stop database collection -- exceeded limit!
        /*
        https.get(url, function(response) {
            var body = '';

            response.on('data', function(chunk) {
                body += chunk;
            });

            response.on('end', function() {
                //var jsonObj = JSON.parse(body)
                pg.connect(dburl, function(err, client, done) {
                    client.query('insert into instagram values ($1)', [body], function(err, result) {
                        console.log([body]);
                        done();
                        if(err) return console.error(err);
                        console.log(result.rows);
                    });
                });
            });
        });*/
    });
    
    res.end();
});

function sendMessage(url) {
    io.sockets.emit('show', { show: url });
}

console.log("Listening on port " + port);
