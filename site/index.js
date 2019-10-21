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
const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
var getDaysArray = function(start, end) {
    for(var arr=[],dt=start; dt<=end; dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt).toLocaleDateString().split(",")[0]);
    }
    return arr;
};
app.get("/", function(req, res){
    var events
    collection.find().sort({"time": 1}).toArray((err, items) => {
        events = items
        dates = []
        date_objs = []
        mapped_by_date = {}
        for (i = 0; i < events.length; i++) {
            date_objs.push(events[i]["time"])
            date = events[i]["time"].toLocaleDateString()
            if (mapped_by_date[date]== null){
                dates.push(date)
                mapped_by_date[date] = {"barks": 1, "peak_sound_intensities": [events[i]["peak_sound_intensity"]], "durations": [events[i]["duration"]] }
            } else {
                mapped_by_date[date]["barks"] += 1
                mapped_by_date[date]["peak_sound_intensities"].push(events[i]["peak_sound_intensity"])
                mapped_by_date[date]["durations"].push(events[i]["duration"])
            }
        }
        barks = []
        intensities = []
        durations = []
        for (i = 0; i < dates.length; i++){
            barks.push(mapped_by_date[dates[i]]["barks"])
            intensities.push(average(mapped_by_date[dates[i]]["peak_sound_intensities"]))
            durations.push(average(mapped_by_date[dates[i]]["durations"]))
            
        }
        context = {
            dates: "'"+getDaysArray(date_objs[0], date_objs[date_objs.length-1]).join("', '")+"'",
            barks: barks,
            intensities: intensities,
            durations: durations
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
  http.listen(80, function() {
  	console.log('listening on *:80');
  });
})

app.use('/', express.static('www'));