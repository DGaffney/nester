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
var MongoClient = require('mongodb').MongoClient,
f = require('util').format,
assert = require('assert');
var url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const connection = client.connect()
connection.then(() => {
    const doc = { id: 3 }
    const db = client.db('database_name')
    const coll = db.collection('collection_name')
    coll.insertOne(doc, (err, result) => {
        if(err) throw err
    })
})
// Use connect method to connect to the Server
var io = require('socket.io')(http)
const findDocuments = function(db, callback) {
	// Get the documents collection
	const collection = db.collection('scored_posts');
	// Find some documents
	collection.find({}).sort([
		['created_at', -1]
	]).toArray(function(err, docs) {
		assert.equal(err, null);
		callback(docs);
	});
}

// app.use(express.static('files'))
http.listen(9123, function() {
	console.log('listening on *:9123');
});

app.use('/', express.static('www'));