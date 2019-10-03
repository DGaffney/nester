const bodyParser = require('body-parser');
const request = require('request');
var config = require('config');
yaml = require('js-yaml');
fs   = require('fs');

var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
var http = require('http').Server(app);

const Redis = require('ioredis');
var config = require('../api/settings.json');
var api = require("./api.js")
var mongo_config = yaml.safeLoad(fs.readFileSync('../api/mongoid.yml', 'utf8'));
db_info = mongo_config[config.environment].clients.default


const redis = new Redis({
	"host": config.redis_host,
	"password": config.redis_password
});
var MongoClient = require('mongodb').MongoClient,
f = require('util').format,
assert = require('assert');
var url = 'mongodb://'+db_info.options.user+':'+db_info.options.password+'@'+db_info.hosts[0]+'/?authMechanism=DEFAULT&authSource='+db_info.options.auth_source;
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
app.get("/lookup_business.json", function(req, res) {
    api.lookup_business(req.query.name, req.query.location, function(body){
        res.send(body)
    })
})
app.get("/similar_businesses.json", function(req, res) {
    api.similar_businesses(req.query.business_id, function(body){
        res.send(body)
    })
})
app.get("/notifications.json", function(req, res) {
    api.notifications(req.query.business_id, function(body){
        res.send(body)
    })
})
app.get('/cross_referenced_facts.json', function(req, res) {
	request("http://" + config.api_host + "/api/cross_references/"+req.query.story_id+".json", {
		json: true
	}, (err, ress, body) => {
		res.send(ress.body)
	});
})
app.get('/key_facts.json', function(req, res) {
	if (req.query.skip == null) {
		req.query.skip = 0
	}
	if (req.query.limit == null) {
		req.query.limit = 50
	}
	request("http://" + config.api_host + "/api/story_facts/" + req.query.story_id + ".json?skip=" + req.query.skip + "&limit=" + req.query.limit + "&fact_type=missing_twitter_user,overrepresented_twitter_user,frequent_nonobvious_term,additional_reading", {
		json: true
	}, (err, ress, body) => {
		res.send(ress.body)
	});
})
redis.on('message', (channel, message) => {
	parsed_message = JSON.parse(message)
	io.sockets.emit(channel, parsed_message);
});

redis.subscribe('all_events_channel', (error, count) => {
	if (error) {
		throw new Error(error);
	}
	console.log(`Subscribed to ${count} channel. Listening for updates on the all_events_channel channel.`);
});
app.use('/', express.static('www'));