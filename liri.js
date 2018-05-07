require("dotenv").config();

var fs = require("fs");
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

if (command === "my-tweets") {
    myTweets();
} else if (command === "spotify-this-song") {
    spotifyThisSong();
} else if (command === "movie-this") {
    movieThis();
} else if (command === "do-what-it-says") {
    doWhatItSays();
} else {
    console.log("Need the command!!!")
}

function myTweets() {
    client.get('statuses/home_timeline', function (error, tweets, response) {

        for (var i = 0; i < 3; i++) {
            console.log(i + 1 + ') TEXT: ' + tweets[i].text + '\n    DATE: ' + tweets[i].created_at);
        }
    });
}

function spotifyThisSong() {
    var song = process.argv[3];
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        for (var i = 0; i < 3; i++) {
            console.log('\n========= ( ' + i + ' ) =========');
            console.log('ARTIST: ' + data.tracks.items[i].album.artists[0].name);
            console.log('SONG: ' + data.tracks.items[i].name);
            console.log('PREVIEW URL: ' + data.tracks.items[i].preview_url);
            console.log('ALBUM: ' + data.tracks.items[i].album.name);
        }
    });
}

function movieThis() {
    var nodeArgs = process.argv;
    var movieName = "";

    for (var i = 2; i < nodeArgs.length; i++) {
        if (i > 2 && i < nodeArgs.length) {
            movieName = movieName + "+" + nodeArgs[i];
        }
        else {
            movieName += nodeArgs[i];
        }
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("imdb Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        var command = dataArr[0];
        var item = dataArr[1];

        spotify.search({ type: 'track', query: item }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
    
            for (var i = 0; i < 3; i++) {
                console.log('\n========= ( ' + i + ' ) =========');
                console.log('ARTIST: ' + data.tracks.items[i].album.artists[0].name);
                console.log('SONG: ' + data.tracks.items[i].name);
                console.log('PREVIEW URL: ' + data.tracks.items[i].preview_url);
                console.log('ALBUM: ' + data.tracks.items[i].album.name);
            }
        });
    });
}

console.log("======================================================================")