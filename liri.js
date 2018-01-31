require('dotenv').config();

// linking the twitter and spotify keys
const keys = require('./keys.js');

// referencing the log
const log = require('simple-node-logger').createSimpleLogger('log.txt');

// liri command input
const command = process.argv[2];

// start the case function for commands
switch (command) {

// node liri.js my-tweets
    case 'my-tweets':
        const Twitter = require('twitter');
        let client = new Twitter(keys.twitter);
        let params = {
            screen_name: 'apsisofara',
            count: 20
        };
        client.get('statuses/user_timeline', params, (err, tweets) => {
            if (err) throw (err);
            tweets.forEach(tweet => {
                log.info(`
                    ${tweet.created_at}
                    ${tweet.text}
                `);
            });
        });
        break;

// node liri.js spotify-this-song '<song name here>'
    case 'spotify-this-song':
        const Spotify = require('node-spotify-api');
        let spotify = new Spotify(keys.spotify);
        let songSearch = process.argv[3];
        if (songSearch === undefined) {
            songSearch = 'ace-of-base'
        };
        spotify.search({ type: 'track', query: songSearch, limit: 1 }, (err, data) => {
            if (err) throw (err);
            const songObject = data.tracks.items[0];
            log.info(`
                ${songObject.artists[0].name}
                ${songObject.name}
                ${songObject.external_urls.spotify}
                ${songObject.album.name}
            `);
        });
        break;

// node liri.js movie-this '<movie name here>'
    case 'movie-this':
        const request = require('request');
        let movieSearch = process.argv[3];
        if (movieSearch === undefined) {
            movieSearch = 'Mr. Nobody'
        };
        request('https://www.omdbapi.com/?apikey=trilogy&t=' + movieSearch, (err, response, data) => {
            if (err) throw (err);
            let jsonData = JSON.parse(data);
            log.info(`
                ${jsonData.Title}
                ${jsonData.Year}
                ${jsonData.Ratings[0].Source} ${jsonData.Ratings[0].Value}
                ${jsonData.Ratings[1].Source} ${jsonData.Ratings[1].Value}
                ${jsonData.Country}
                ${jsonData.Language}
                ${jsonData.Plot}
                ${jsonData.Actors}
            `);
        });
        break;

// node liri.js do-what-it-says
    case 'do-what-it-says':
        const fs = require('fs');
        const cmd = require('node-command-line');
        fs.readFile("random.txt", "utf8", (err, data) => {
            if (err) throw (err);
            let random = data.split(',');
            cmd.run('node liri.js ' + random[0] + ' ' + random[1]);
        });
        break;
    default:
        console.log('Valid commands are "my-tweets", "spotify-this-song", "movie-this", "do-what-it-says"');
}