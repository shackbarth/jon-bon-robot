$("#submitButton").click(function () {
  console.log("Let us now rock and roll");
  $("#lyricsTextBox").css({display: "none"});
  $("#lyricsLabel").css({display: "none"});
  $("#submitButton").css({display: "none"});
  $("#chatBox").css({display: "block"});
  $("#chatBox").html("> I'm about to rock your socks off");
  $.ajax("/lyrics/verses")
    .done(function (results, status, options) {
      console.log("success", JSON.stringify(results));
      $("#chatBox").css({display: "none"});
      $("#lyricsResult").css({display: "block"});
      $("#lyricsResult").html(results.join("<br><br>"));
    });
});
