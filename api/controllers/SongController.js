/**
 * SongController
 *
 * @description :: Server-side logic for managing songs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var lyrics = require("../../../twitter-poetry/lib/twitter_poetry"), // TODO: npm publish
  popMusicGenerator = require("../../../pop-music-generator/lib/generator"), // TODO: npm publish
  creds = require("../../../twitter-poetry/api_keys").keys; // TODO: env var

module.exports = {
  generate: function (req, res) {
    var chatBack = function (message) {
      sails.sockets.emit(req.socket.id, "chatter", {message: message});
    };
    var abc = "abc!";
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
