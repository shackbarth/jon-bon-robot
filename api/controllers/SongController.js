/**
 * SongController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require("lodash"),
  async = require("async"),
  rhyme = require('rhyme'),
  lyrics = require("../../../twitter-poetry"), // TODO: npm publish
  popMusicGenerator = require("../../../pop-music-generator/lib/generator"), // TODO: npm publish
  creds = require("../../../twitter-poetry/api_keys").keys; // TODO: env var


var stub = [ [ 'I\'m not even sad but I\'m listening',
    'to every sad song I know. why',
    'I just realized it\'s the last night',
    'of summer I\'m sad now bye' ],
  [ 'Promise to love you &amp; obey, &amp;',
    'hit it more than once a day',
    '"Sacrafice, thats what we do for',
    'the people we love" If I Stay' ],
  [ 'a kiss on the cheek don\'t mean',
    'fit unless it means fit',
    'i love love love when people',
    'text me with my name in it' ],
  [ 'Baby i don\'t know why you',
    'treating me so bad',
    'forrest gump by frank ocean reminds',
    'me of zayn wow im soooo sad' ],
  [ 'Wish Broncos/ Texans was on TV.',
    'World love to watch that',
    'I thought diggz was DROPPIN that',
    'time is money foo bar he at' ] ];
/*
lyrics = {

  gatherVerse: function (options, callback) {
    callback(null, stub);
  }
};
*/

var chatter = {

  validateTooShort: [
    "Get some sleep and come back when you've got something to say.",

    "Need more words, buck."
  ],

  validateTooLong: [
    "Who do you think you are, Bob Dylan?~Try something shorter",

    "You gotta be kidding me."
  ],

  welcome: [
    "Imagine for a moment that you're being rocked harder than you've ever been rocked before.~" +
    "That dream is about to become a reality",

    "I'm about to rock your socks off"


  ],

  form: [
    "You know those songs where it just starts in with the refrain, and then hits that refrain" +
    "again right away?~This is going to be one of those songs",

    "What we're looking at here is a classic verse-verse-refrain sort of build up.~" +
    "And to hell with the bridge.",

    "This mother is going to have five strophes.~Strophe is a word that you sometimes " +
    "hear when you're about to get your socks rocked off by a robotic rocker."

  ],


  brag: [
    "I'm really feeling this song.~Even though I'm a robot living in some server room " +
    "possibly in Northern Virginia.",

    "I hope you're sitting down for this when I send it across the tubes at you.",

    "This song is going to literally light your hair on fire."

  ],

  twitter: [
    "Let me consult my muse.",

    "Twitter, speak to me.",

    "You would not believe what I'm hearing on my Twitter phone right now.",

    "I've got this enormous pipe open to Twitter and the stuff I'm pulling down is solid gold.",

    "Lots of platinum-record-worthy action passing through Twitter right now.",

    "It's no secret that Twitter is my ghostwriter. You can't make this stuff up.",

    "The Internet is basically a series of tubes.~I've got a tube open right now to Twitter " +
    "and the things I'm hearing is solid gold.",

    "Ok, straight from the tweets of unsuspecting passersby right into your rock song."


  ]
};

var getChat = function (category) {
  return _.sample(chatter[category]);
};

var log;
var logAll = function (message) {
  message.split("~").map(function (messageLine) {
    log(messageLine);
  });
};

var validate = function (inspiration, done) {
  var MIN_SYLLABLES = 3;
  var MAX_SYLLABLES = 10;
  if (!inspiration) {
    // probably move this validation to the browser
    logAll("You need to enter something");
    return done("invalid");
  }
  var syllableCount = lyrics.getSyllableCount(inspiration);
  if (syllableCount < MIN_SYLLABLES) {
    logAll(getChat("validateTooShort"));
    return done("invalid");
  };
  if (syllableCount > MAX_SYLLABLES) {
    logAll(getChat("validateTooLong"));
    return done("invalid");
  };
  log(inspiration);
  done();
};


module.exports = {
  generate: function (req, res) {
    log = function (message) {
      sails.sockets.emit(req.socket.id, "chatter", {message: message});
    };

    async.waterfall([
      function (callback) {
        validate(req.body.inspiration, callback);
      },
      function (callback) {
        lyrics.gatherVerse({creds: creds, log: log, captureTweet: Tweet.captureTweet}, callback);
      },
      function (verses, callback) {
        var abc = popMusicGenerator.generateMusic(verses, req.body.inspiration);
        callback(null, abc);
      },
      function (abc, callback) {
        Song.create({title: req.body.inspiration, body: abc}).exec(callback);
      },
      function (created, callback) {
        res.send({id: created.id});
        callback();
      }
    ], function (err, results) {
      console.log(arguments);
    });

  },

  render: function (req, res) {
    Song.findOne({id: req.params.id}).exec(function (err, song) {
      if (err) {
        return res.redirect("500");
      } else if (!song) {
        return res.redirect("404");
      }
      res.render("render", {title: song.title, body: song.body});
    });
  }
};
