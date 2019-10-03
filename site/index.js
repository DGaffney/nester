const bodyParser = require('body-parser');
const request = require('request');
var config = require('config');
fs   = require('fs');
var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
var http = require('http').Server(app);
var f = require('util').format,
assert = require('assert');
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017';
mongo.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, (err, client) => {
  if (err) {
    console.error(err)
    return
  }
})
const db = client.db('nest')
const collection = db.collection('events')

app.get("/", function(req, res){
    collection.find().toArray((err, items) => {
        context = {
            events: items,
        }
        res.render("www/index.html", context)
    })
})
// app.use(express.static('files'))
http.listen(9123, function() {
	console.log('listening on *:9123');
});

app.use('/', express.static('www'));