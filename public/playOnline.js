let ws = new WebSocket("ws://213.229.25.14:8080");

ws.onerror = function error() {
  console.error();
  ws.close();
  ws=new WebSocket("ws://213.229.25.14:8080");
};

ws.onopen = function open() {
  ws.send(JSON.stringify({
    type: "cookie",
    data: getCookie("token")
  }));
};


ws.onmessage = function message(message) {


  var data = JSON.parse(message.data);


  if (data.type == "startGame") {
    document.getElementById("pe").innerText = data.pe;
    document.getElementById("peRanking").innerText = data.ranking;
  } else if (data.type == "move") {
    curColor = data.moveColor;
    pieces = data.pieces;
    console.log(data.clockE, data.clockS)
    timeE = data.clockE;
    timeS = data.clockS;
    console.log(timeE, timeS)
    setClocks();
    if (ownColor == "Black") {
      for (let i = 0; i < pieces.length; i++) {
        pieces[i].pos = (9 - data.pieces[i].pos.charAt(0)) + "" + (9 - data.pieces[i].pos.charAt(1));
        if (pieces[i].color == "Black" && pieces[i].name == "Pawn") {
          for (let j = 0; j < pieces[i].moves.length; j++) {
            pieces[i].moves[j] = pieces[i].moves[j].replace("D", "U");

          }
        }
      }
    }
    drawPieces();
  }

};




function getCookie(name) {
  var cookieArr = document.cookie.split(";");

  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    if (name === cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}


//sending move to server
//move Layout:Stringified JSON:
//{ type: "move", moveColor: curColor, move: overlays[i].id, oldPiece: originalPiece, newPiece: pieces[j]} 
function sendMove(move) {
  ws.send(move)
}