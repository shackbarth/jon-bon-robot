$("#submitButton").click(function () {
  console.log("Let us now rock and roll");
  $("#lyricsTextBox").css({display: "none"});
  $("#lyricsLabel").css({display: "none"});
  $("#submitButton").css({display: "none"});
  $("#chatBox").css({display: "block"});
  $("#chatBox").html("> I'm about to rock your socks off");
  console.log(io.socket.id);
  io.socket.get("/lyrics/verses", function (results) {
    console.log("success", JSON.stringify(results));
    $("#chatBox").css({display: "none"});
    $("#lyricsResult").css({display: "block"});
    $("#lyricsResult").html(results.join("<br><br>"));
    console.log("successargs", JSON.stringify(arguments));
  });

  var chatLog = ["I'm about to rock your socks off"];
  io.socket.on("chatter", function (data) {
    console.log("chat", arguments);
    chatLog.push(data.message);
    $("#chatBox").html(chatLog.join("<br>> "));

  });
});
