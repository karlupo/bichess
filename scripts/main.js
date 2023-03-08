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
  new Rook("70", "White")
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
