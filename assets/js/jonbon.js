


$("#submitButton").click(function () {
  console.log("Let us now rock and roll");
  $("#lyricsLabel").css({display: "none"});
  $("#lyricsTextBox").css({display: "none"});
  $("#submitButton").css({display: "none"});
  $("#chatBox").html("> I'm about to rock your socks off");
  $("#chatBox").css({display: "block"});
  //animate();
  io.socket.get("/song/generate", {inspiration: $("#lyricsTextBox").val()}, function (result) {
    //$("#chatBox").css({display: "none"});
    window.open("/song/render/" + result.id, "_blank");
    //$("#lyricsResult").css({display: "block"});
    //ABCJS.renderAbc("lyricsResult", result);
    //$("#lyricsResult").css({display: "block"});
  });

  var chatLog = ["I'm about to rock your socks off"];
  var chatInterval;
  io.socket.on("chatter", function (data) {
    chatLog.push(data.message);
    var MAX_CHATS = 8;
    if (chatLog.length > MAX_CHATS) {
      chatLog.splice(0, chatLog.length - MAX_CHATS);
    }
    var topRows = chatLog.slice(0, chatLog.length - 2);
    var bottomRow = chatLog[chatLog.length - 1];
    var chatboxText = "> " + topRows.join("<br>> ") + "<br>> ";
    var i = 0;
    if (chatInterval) {
      clearInterval(chatInterval);
    }
    chatInterval = setInterval(function () {
      if (i === bottomRow.length) {
        clearInterval(chatInterval);
        return;
      }
      chatboxText = chatboxText + bottomRow.charAt(i++);
      $("#chatBox").html(chatboxText);
    }, 10);

  });
});
/*
init();

function init() {

    var output = document.createElement( 'div' );
    output.style.cssText = 'position: absolute; left: 50px; top: 300px; font-size: 100px';
    document.body.appendChild( output );

    var tween = new TWEEN.Tween( { x: 0 } )
        .to( { x: 100 }, 5000 )
        .easing( TWEEN.Easing.Quadratic.Out )
        .onUpdate( function () {
          var inputArea = $("#inputArea");
          var percentDone = this.x / 100;
          inputArea.css({opacity: 1.0 - percentDone});
          $("#chatBox").css({opacity: percentDone});
        } )
        .start();

}

function animate( time ) {

    requestAnimationFrame( animate );
    TWEEN.update( time );

}
*/
