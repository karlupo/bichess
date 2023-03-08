//Array of pieces
let pieces = [
  new Pawn("01", "White"),
  new Pawn("11", "White"),
  new Pawn("21", "White"),
  new Pawn("31", "White"),
  new Pawn("41", "White"),
  new Pawn("51", "White"),
  new Pawn("61", "White"),
  new Pawn("71", "White"),
  new Rook("00", "White"),
  new Knight("10", "White"),
  new Bishop("20", "White"),
  new Queen("30", "White"),
  new King("40,", "White"),
  new Bishop("50", "White"),
  new Knight("60", "White"),
  new Rook("70", "White"),





  new Pawn("06", "Black"),
  new Pawn("16", "Black"),
  new Pawn("26", "Black"),
  new Pawn("36", "Black"),
  new Pawn("46", "Black"),
  new Pawn("56", "Black"),
  new Pawn("66", "Black"),
  new Pawn("76", "Black"),
  new Rook("07", "Black"),
  new Knight("17", "Black"),
  new Bishop("27", "Black"),
  new Queen("37", "Black"),
  new King("47,", "Black"),
  new Bishop("57", "Black"),
  new Knight("67", "Black"),
  new Rook("77", "Black")
];

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
