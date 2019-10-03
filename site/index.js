const bodyParser = require('body-parser');
const request = require('request');
var config = require('config');
fs   = require('fs');
var express = require('express');
var app = express();
var engines = require('consolidate');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
var http = require('http').Server(app);
var f = require('util').format,
assert = require('assert');
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017';
app.get("/", function(req, res){
    collection.find().toArray((err, items) => {
        context = {
            events: items,
        }
        res.render("../www/index.html", context)
    })
})
// app.use(express.static('files'))
var db
var collection
mongo.connect(url, (err, client) => {
  if (err) return console.log(err)
  db = client.db("nest") // whatever your database name is
  collection = db.collection('events')
  http.listen(9123, function() {
  	console.log('listening on *:9123');
  });
})

app.use('/', express.static('www'));