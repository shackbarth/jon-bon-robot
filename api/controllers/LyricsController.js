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
    lyrics.gatherVerse({creds: creds}, function (err, verses) {
      console.log("Time to send");
      return res.send(verses);
    });
  }
};

