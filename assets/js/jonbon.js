$("#submitButton").click(function () {
  console.log("Let us now rock and roll");
  $("#lyricsLabel").css({display: "none"});
  $("#lyricsTextBox").css({display: "none"});
  $("#submitButton").css({display: "none"});
  $("#chatBox").html("> I'm about to rock your socks off");
  $("#chatBox").css({display: "block"});
  //animate();
  io.socket.get("/lyrics/verses", {inspiration: $("#lyricsTextBox").val()}, function (results) {
    $("#chatBox").css({display: "none"});
    $("#lyricsResult").css({display: "block"});
    ABCJS.renderAbc("lyricsResult", results);
    $("#lyricsResult").css({display: "block"});
  });

  var chatLog = ["I'm about to rock your socks off"];
  io.socket.on("chatter", function (data) {
    chatLog.push(data.message);
    $("#chatBox").html(chatLog.join("<br>> "));
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
