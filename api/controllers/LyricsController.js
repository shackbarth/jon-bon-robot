/**
 * LyricsController
 *
 * @description :: Server-side logic for managing lyrics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var lyrics = require("../../../twitter-poetry/lib/twitter_poetry"), // TODO: npm publish
  popMusicGenerator = require("../../../pop-music-generator/lib/generator"), // TODO: npm publish
  creds = require("../../../twitter-poetry/api_keys").keys; // TODO: env var

module.exports = {
  verses: function (req, res) {
    var chatBack = function (message) {
      sails.sockets.emit(req.socket.id, "chatter", {message: message});
    };
    lyrics.gatherVerse({creds: creds, log: chatBack}, function (err, verses) {
      console.log(verses);
      var abc = popMusicGenerator.generateMusic(verses, req.body.inspiration);
      return res.send(abc);
    });
  }
};

