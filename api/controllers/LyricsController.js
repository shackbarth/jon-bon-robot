/**
 * LyricsController
 *
 * @description :: Server-side logic for managing lyrics
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var lyrics = require("../../../twitter-poetry/lib/twitter_poetry"), // TODO: npm publish
  creds = require("../../../twitter-poetry/api_keys").keys; // TODO: env var

module.exports = {
  verses: function (req, res) {
    var chatBack = function (message) {
      sails.sockets.emit(req.socket.id, "chatter", {message: message});
    };
    lyrics.gatherVerse({creds: creds, log: chatBack}, function (err, verses) {
      return res.send(verses);
    });
  }
};

