//Array of pieces
let pieces = [
  new Pawn("17", "White"),
  new Pawn("27", "White"),
  new Pawn("37", "White"),
  new Pawn("47", "White"),
  new Pawn("57", "White"),
  new Pawn("67", "White"),
  new Pawn("77", "White"),
  new Pawn("87", "White"),
  new Rook("18", "White"),
  new Knight("28", "White"),
  new Bishop("38", "White"),
  new Queen("48", "White"),
  new King("58,", "White"),
  new Bishop("68", "White"),
  new Knight("78", "White"),
  new Rook("88", "White"),





  new Pawn("12", "Black"),
  new Pawn("22", "Black"),
  new Pawn("32", "Black"),
  new Pawn("42", "Black"),
  new Pawn("52", "Black"),
  new Pawn("62", "Black"),
  new Pawn("72", "Black"),
  new Pawn("82", "Black"),
  new Rook("11", "Black"),
  new Knight("21", "Black"),
  new Bishop("31", "Black"),
  new Queen("41", "Black"),
  new King("51,", "Black"),
  new Bishop("61", "Black"),
  new Knight("71", "Black"),
  new Rook("81", "Black")
];


function drawPieces(){
  for(let i = 0; i < pieces.length; i++){
    let fig = document.createElement("div");
    fig.className = "figure";
    fig.style.backgroundImage = "url('../img/" + pieces[i].name + pieces[i].color + ".png')";

    fig.style.gridColumn = parseInt(pieces[i].pos.charAt(0));
    fig.style.gridRow = parseInt(pieces[i].pos.charAt(1));
    document.getElementById("figures").appendChild(fig)
  }
  
}

drawPieces();

//Draw Chessboard Tiles
for (let i = 0; i < 64; i++) {
  let div = document.createElement("div");

  if (i % 16 < 8) {
    if (i % 2 == 0) {
      div.style.backgroundColor = "rgb(235,235,211)";
    } else {
      div.style.backgroundColor = "rgb(116,148,84)";
    }
  } else {
    if (i % 2 != 0) {
      div.style.backgroundColor = "rgb(235,235,211)";
    } else {
      div.style.backgroundColor = "rgb(116,148,84)";
    }
  }

  document.getElementById("chessboard").appendChild(div);
}

const d = new Pawn("01", "Black");
