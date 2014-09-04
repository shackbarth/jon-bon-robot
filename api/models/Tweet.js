/**
* Tweet.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var lyrics = require("../../../twitter-poetry"), // TODO: npm publish
  rhyme = require('rhyme'),
  rhymer;

var captureTweet = function (tweet, stream) {
  console.log("I am here", arguments);
  var tweetSyllables = lyrics.getSyllableCount(tweet);
  if (tweetSyllables < 6 || tweetSyllables > 18) {
    return;
  }
  var tweetWords = tweet.split(" ");
  var lastWord = tweetWords[tweetWords.length - 1];
  var lastWordRhymes = rhymer.rhyme(lastWord);
  var rhymingTweet = _.find(allTweets, function (savedTweet) {
    return _.contains(lastWordRhymes, savedTweet.lastWord.toUpperCase());

  });
  if (rhymingTweet) {
    log(tweet);
    log(rhymingTweet.tweet);
    allTweets = _.without(allTweets, rhymingTweet);
    verses.push([
      tweet.substring(0, getMidpointSpaceIndex(tweet)),
      tweet.substring(1 + getMidpointSpaceIndex(tweet)),
      rhymingTweet.tweet.substring(0, getMidpointSpaceIndex(rhymingTweet.tweet)),
      rhymingTweet.tweet.substring(1 + getMidpointSpaceIndex(rhymingTweet.tweet))
    ]);
    if (verses.length >= options.verseLimit) {
      stream.destroy();
      return callback(null, verses);
    }
  } else {
    allTweets.push({tweet: tweet, lastWord: lastWord});
  }
}

module.exports = {

  attributes: {
    text: {
      type: "string"
    },
    lastWord: {
      type: "string"
    },
    syllableCount: {
      type: "integer"
    }
  },

  captureTweet: function (tweet, stream) {
    console.log("1");
    if (rhymer) {
      captureTweet(tweet, stream);
      return;
    }
    rhyme(function (r) {
      console.log("2");
      rhymer = r;
      captureTweet(tweet, stream);
    });
  }
};

