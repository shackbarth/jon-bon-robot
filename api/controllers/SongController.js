/**
 * SongController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var lyrics = require("../../../twitter-poetry/lib/twitter_poetry"), // TODO: npm publish
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
lyrics = {

  gatherVerse: function (options, callback) {
    callback(null, stub);
  }
};

var chatter = {
  welcome: [
    "Imagine for a moment that you're being rocked harder than you've ever been rocked before.~" +
    "That dream is about to become a reality",




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



}

module.exports = {
  generate: function (req, res) {
    var chatBack = function (message) {
      sails.sockets.emit(req.socket.id, "chatter", {message: message});
    };
    var abc = "abc!";
    lyrics = {
      gatherVerse: function (options, callback) {
        var i = 0;
        var myInterval = setInterval(function () {
          if (i === chatter.form.length) {
            clearInterval(myInterval);
            return callback(null, stub);
          }
          chatter.form[i].split("~").map(function (chat) {
            chatBack(chat);
          });
          i++;

        }, 2000);
      }
    };
    lyrics.gatherVerse({creds: creds, log: chatBack}, function (err, verses) {
      console.log(verses);
      var abc = popMusicGenerator.generateMusic(verses, req.body.inspiration);
      Song.create({title: req.body.inspiration, body: abc}).exec(function (err, created) {
        return res.send({id: created.id});
      });
    });
  },

  render: function (req, res) {
    Song.findOne({id: req.params.id}).exec(function (err, song) {
      console.log("song", arguments);
      if (err) {
        return res.redirect("500");
      } else if (!song) {
        return res.redirect("404");
      }
      res.render("render", {title: song.title, body: song.body});
    });
  }
};
