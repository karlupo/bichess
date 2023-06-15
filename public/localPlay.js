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
  new King("58", "White"),
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
  new King("51", "Black"),
  new Bishop("61", "Black"),
  new Knight("71", "Black"),
  new Rook("81", "Black")
];

let piecesDivs = [];

let curclicked = null;
let curClickedDiv = null;
let curColor = "White";
let chessboard = document.getElementById("chessboard");
let clicked = false;
let blocked = false;
let enPassentChance = "";
let enPassentColor = "";
let whiteMovedPiecesRochade = [false, false, false]; //0 = king, 1 = rook left, 2 = rook right
let blackMovedPiecesRochade = [false, false, false]; //0 = king, 1 = rook left, 2 = rook right
let isGameBeginning = true;

let allTime = 180;

let time1 = allTime;
let time2 = allTime;

let curStyle = 0;
let tilesColors = ["rgb(182,148,110)", "rgb(255,241,220)", "rgb(80, 42, 4)", "rgb(255,241,220)"];

let intervalID;

chessboard.addEventListener("mousedown", drawArrow);
chessboard.addEventListener("click", movePiece);
chessboard.addEventListener("mouseup", finisharrow);
chessboard.addEventListener("contextmenu", function (event) {
  event.preventDefault();
})

drawboard();
drawPieces();

//Schachuhr
document.getElementById("time1").innerHTML = Math.trunc(time1 / 60) + ":" + ((String)(time1 % 60)).padStart(2, "0");
document.getElementById("time2").innerHTML = Math.trunc(time2 / 60) + ":" + ((String)(time2 % 60)).padStart(2, "0");

//Draw Arrow
let startedX = -1;
let startedY = -1;
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

canvas.width = chessboard.getBoundingClientRect().width;
canvas.height = chessboard.getBoundingClientRect().height;



function drawArrow(event) {
  if (event.button == 2) {
    let x = getTile(event).column * size - size / 2;
    let y = getTile(event).row * size - size / 2;
    ctx.beginPath();
    ctx.moveTo(x, y)
    startedX = getTile(event).column;
    startedY = getTile(event).row;
  }
}

let offset = 600;

function drawArrow(event) {
  offset = canvas.width / 8;
  if (event.button == 2) {

    let x = getTile(event).column * offset - offset / 2;
    let y = getTile(event).row * offset - offset / 2;
    ctx.beginPath();

    ctx.moveTo(x, y)

    startedX = getTile(event).column;
    startedY = getTile(event).row;
  }



}



function finisharrow(event) {

  if (startedX != -1 && event.button == 2) {
    ctx.lineWidth = canvas.width / 30;
    ctx.strokeStyle = "rgba(255, 175, 0, 0.7)";
    let x = getTile(event).column * offset - offset / 2;
    let y = getTile(event).row * offset - offset / 2;

    if (Math.abs(startedX - getTile(event).column) == 1 && Math.abs(startedY - getTile(event).row) == 2) {
      ctx.lineTo(startedX * offset - offset / 2, y);
      if (startedX * offset - offset / 2 > x) {
        ctx.lineTo(x + canvas.width / 16, y);
      } else {
        ctx.lineTo(x - canvas.width / 16, y);
      }
      ctx.stroke();
      ctx.closePath();
      if (startedX * offset - offset / 2 > x) {
        drawArrowHead(x, y, 0);
      } else {
        drawArrowHead(x, y, Math.PI);
      }

    } else if (Math.abs(startedX - getTile(event).column) == 2 && Math.abs(startedY - getTile(event).row) == 1) {
      ctx.lineTo(x, startedY * offset - offset / 2);
      if (startedY * offset - offset / 2 > y) {
        ctx.lineTo(x, y + canvas.width / 16);
      } else {
        ctx.lineTo(x, y - canvas.width / 16);
      }
      ctx.stroke();
      ctx.closePath();
      if (startedY * offset - offset / 2 > y) {
        drawArrowHead(x, y, Math.PI / 2);
      } else {
        drawArrowHead(x, y, Math.PI * 3 / 2);
      }

    } else {
      let angle = calcAngle(startedX * offset - offset / 2, startedY * offset - offset / 2, getTile(event).column * offset - offset / 2, getTile(event).row * offset - offset / 2);
      let length = Math.sqrt(Math.pow(startedX * offset - offset / 2 - x, 2) + Math.pow(startedY * offset - offset / 2 - y, 2));

      x = startedX * offset - offset / 2 - Math.cos(angle) * (length - 50);
      y = startedY * offset - offset / 2 - Math.sin(angle) * (length - 50);

      ctx.lineTo(x, y);

      ctx.closePath();
      if (startedX != getTile(event).column || startedY != getTile(event).row) {
        ctx.stroke();
        drawArrowHead(getTile(event).column * offset - offset / 2, getTile(event).row * offset - offset / 2, angle);

      }
    }


    startedX = -1;
    startedY = -1;

  }


}

function calcAngle(x1, y1, x2, y2) {
  let angle = Math.atan2(y1 - y2, x1 - x2);
  return angle;
}



function drawArrowHead(x, y, angle) {
  let width = canvas.width / 30;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(2 * width, width);
  ctx.lineTo(2 * width, 10);
  ctx.lineTo(width * 2.5, width / 2);
  ctx.lineTo(width * 2.5, -width / 2);
  ctx.lineTo(2 * width, -width / 2);
  ctx.lineTo(2 * width, -width);
  ctx.closePath();
  ctx.restore();
  ctx.fillStyle = "rgba(255, 175, 0, 0.7)";
  ctx.fill();
}

function getTile(event) {
  let column = (event.clientX - chessboard.getBoundingClientRect().left) / (chessboard.offsetWidth / 8);
  let row = (event.clientY - chessboard.getBoundingClientRect().top) / (chessboard.offsetHeight / 8);
  return { column: Math.ceil(column), row: Math.ceil(row) };
}


function removeChildren(parent, child) {
  for (let i = 0; i < child.length; i++) {
    try {
      document
        .getElementById(parent)
        .removeChild(document.getElementsByClassName(child)[i]);
    } catch (error) { }
  }
}


let tempX = 0;
let tempY = 0;

document.addEventListener("scroll", (event) => {
  if (clicked) {
    let clientBounding = chessboard.getBoundingClientRect();
    curClickedDiv.style.left = (tempX - clientBounding.x - (curClickedDiv.offsetWidth / 2)) + "px";
    curClickedDiv.style.top = (tempY - clientBounding.y - (curClickedDiv.offsetHeight / 2)) + "px";
    curClickedDiv.style.gridColumn = "";
    curClickedDiv.style.gridRow = "";
    curClickedDiv.style.zIndex = "999";
  }
});

chessboard.addEventListener("mousemove", function (e) {
  var x = e.clientX;
  var y = e.clientY;
  tempX = x;
  tempY = y;
  if (clicked) {
    if (curClickedDiv == null) return;
    let clientBounding = chessboard.getBoundingClientRect();
    curClickedDiv.style.left = (x - clientBounding.x - (curClickedDiv.offsetWidth / 2)) + "px";
    curClickedDiv.style.top = (y - clientBounding.y - (curClickedDiv.offsetHeight / 2)) + "px";
    curClickedDiv.style.gridColumn = "";
    curClickedDiv.style.gridRow = "";
    curClickedDiv.style.zIndex = "999";

  }
})

//Draw

function drawPieces() {
  piecesDivs = new Array();
  document.getElementById("figures").innerHTML = "";
  for (let i = 0; i < pieces.length; i++) {
    let fig = document.createElement("div");
    piecesDivs.push(fig)
    fig.className = "figure";
    fig.style.backgroundImage =
      "url('img/chess/" + pieces[i].name + pieces[i].color + ".png')";

    fig.style.gridColumn = parseInt(pieces[i].pos.charAt(0));
    fig.style.gridRow = parseInt(pieces[i].pos.charAt(1));

    fig.addEventListener("mouseup", function (event) {

      fig.style.cursor = 'grab';
    });


    fig.addEventListener("pointerdown", function (event) {
      if (event.button != 0 || blocked) {
        return;
      }

      curClickedDiv = fig;

      var x = tempX;
      var y = tempY;
      let clientBounding = chessboard.getBoundingClientRect();
      curClickedDiv.style.left = (x - clientBounding.x - (curClickedDiv.offsetWidth / 2)) + "px";
      curClickedDiv.style.top = (y - clientBounding.y - (curClickedDiv.offsetHeight / 2)) + "px";
      curClickedDiv.style.gridColumn = "";
      curClickedDiv.style.gridRow = "";
      curClickedDiv.style.zIndex = "999";

      fig.style.cursor = "grabbing";
      getAvailableMoves(pieces[i], fig);
      clicked = true;
    })

    document.getElementById("figures").appendChild(fig)
  }

}

function drawboard() {

  while (chessboard.childNodes.length > 4) {
    if (chessboard.lastChild.id != "figures" && chessboard.lastChild.id != "overlay") {
      chessboard.removeChild(chessboard.lastChild);
    }
  }
  //Draw Chessboard Tiles
  for (let i = 0; i < 64; i++) {
    let div = document.createElement("div");
    div.className = "chesstile"
    if (i % 16 < 8) {
      if (i % 2 == 0) {
        div.style.backgroundColor = tilesColors[curStyle + 1];
      } else {
        div.style.backgroundColor = tilesColors[curStyle];
      }
    } else {
      if (i % 2 != 0) {
        div.style.backgroundColor = tilesColors[curStyle + 1];
      } else {
        div.style.backgroundColor = tilesColors[curStyle];
      }
    }

    chessboard.appendChild(div);
  }
}


function movePiece(event) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let overlays = document.querySelector("#overlay").childNodes
  let clicked = getTile(event);


  parent: for (let i = 0; i < overlays.length; i++) {
    if (clicked.row.toString() == overlays[i].style.gridRow.charAt(0) && clicked.column.toString() == overlays[i].style.gridColumn.charAt(0)) {

      if (overlays[i].className == "overlayRochade") {
        for (let j = 0; j < pieces.length; j++) {
          if (pieces[j] == curclicked) {

            for (let k = 0; k < pieces.length; k++) {

              if (pieces[k].pos == (overlays[i].style.gridColumn + "" + overlays[i].style.gridRow)) {
                if (pieces[k].pos.charAt(0) == 1) {
                  pieces[k].pos = "4" + pieces[k].pos.charAt(1);
                  pieces[j].pos = "3" + pieces[j].pos.charAt(1);
                } else {
                  pieces[k].pos = "6" + pieces[k].pos.charAt(1);
                  pieces[j].pos = "7" + pieces[j].pos.charAt(1);
                }
                document.getElementById("overlay").innerHTML = "";
                if (hasPawnReachedEnd(pieces[j])) {
                  promotePawn(pieces[j]);
                }
                if (curColor == "White") {
                  curColor = "Black"
                } else {
                  curColor = "White";
                }

                break  parent;
              }
            }
          }
        }
      }
      for (let j = 0; j < pieces.length; j++) {
        if (pieces[j] == curclicked) {
          let originalPosY = parseInt(pieces[j].pos.charAt(1));
          let justSetEnPassent = false;
          pieces[j].pos = overlays[i].style.gridColumn.charAt(0) + overlays[i].style.gridRow.charAt(0);
          if (isGameBeginning) {
            intervalID = setInterval(function () {
              //obere Zeit
              if (curColor == "Black") {
                time1--;
                document.getElementById("time1").innerHTML = Math.trunc(time1 / 60) + ":" + ((String)(time1 % 60)).padStart(2, "0");
                document.getElementById("time1Point").classList.toggle("inactiveTimePoint");
                document.getElementById("time2Point").classList.add("inactiveTimePoint");
              }
              //untere Zeit
              else {
                time2--;
                document.getElementById("time2").innerHTML = Math.trunc(time2 / 60) + ":" + ((String)(time2 % 60)).padStart(2, "0");
                document.getElementById("time2Point").classList.toggle("inactiveTimePoint");
                document.getElementById("time1Point").classList.add("inactiveTimePoint");
              }
              if (time1 <= 0) {
                showWinscreen("White");
                clearInterval(intervalID);
              } else if (time2 <= 0) {
                showWinscreen("Black");
                clearInterval(intervalID);
              }
            }, 1000);
          }
          isGameBeginning = false;
          if (pieces[j].name == "Pawn") {
            pieces[j].firstMove = false;
            if (parseInt(pieces[j].pos.charAt(1)) - originalPosY == 2 || parseInt(pieces[j].pos.charAt(1)) - originalPosY == -2) {
              enPassentChance = pieces[j].pos.charAt(0) + (originalPosY + (parseInt(pieces[j].pos.charAt(1)) - originalPosY) / 2);
              enPassentColor = pieces[j].color;
              justSetEnPassent = true;
            }
          }
          if (curColor == "White") {

            if (pieces[j].name == "King") {
              whiteMovedPiecesRochade[0] = true;
            } else if (pieces[j].name == "Rook" && clicked.column == "1") {
              whiteMovedPiecesRochade[1] = true;
            } else if (pieces[j].name == "Rook" && clicked.column == "8") {
              whiteMovedPiecesRochade[2] = true;
            }
          } else {
            if (pieces[j].name == "King") {
              blackMovedPiecesRochade[0] = true;
            } else if (pieces[j].name == "Rook" && clicked.column == "1") {
              blackMovedPiecesRochade[1] = true;
            } else if (pieces[j].name == "Rook" && clicked.column == "8") {
              blackMovedPiecesRochade[2] = true;
            }
          }
          if (hasPawnReachedEnd(pieces[j])) {
            promotePawn(pieces[j]);
          }
          if (curColor == "White") {
            curColor = "Black"
          } else {
            curColor = "White";
          }
          document.getElementById("overlay").innerHTML = "";
          for (let k = 0; k < pieces.length; k++) {
            if ((pieces[k].pos == pieces[j].pos && pieces[j] != pieces[k]) || ((enPassentChance == pieces[k].pos - 1 || enPassentChance == pieces[k].pos + 1) && pieces[j].pos == enPassentChance && pieces[j].name == "Pawn" && pieces[k].name == "Pawn" && pieces[j].color != pieces[k].color)) {
              drawTaken(pieces[k]);
              pieces.splice(k, 1);
              break;
            }
          }
          if (!justSetEnPassent) {
            enPassentChance = "";
            enPassentColor = "";
          }
        }
      }
    }
  }
  drawPieces();

  //Winning Detection
  switch (getGameState()) {
    case 0:
      break;
    case 1:
      showWinscreen(getOppositeColor(curColor));
      break;
    case 2:
      showWinscreen("Patt");
      break;
  }
}

function getAvailableMoves(piece, fig) {

  if (piece.color != curColor) {
    return;
  }

  curclicked = piece
  curClickedDiv = fig
  moves = piece.moves;

  document.getElementById("overlay").innerHTML = "";


  if (canRochade() != false && piece.name == "King" && canRochade() != undefined) {
    for (let i = 0; i < pieces.length; i++) {
      if (canRochade()[0] != -1) {

        if (pieces[i].color == piece.color && pieces[i].name == "Rook" && pieces[i].pos == canRochade()[0] + piece.pos.charAt(1)) {
          drawMoveOverlay(canRochade()[0] + piece.pos.charAt(1), "rochade");
        }
      }
      if (canRochade()[1] != -1) {
        if (pieces[i].color == piece.color && pieces[i].name == "Rook" && pieces[i].pos == canRochade()[1] + piece.pos.charAt(1)) {
          drawMoveOverlay(canRochade()[1] + piece.pos.charAt(1), "rochade");
        }
      }
    }
  }

  for (let i = 0; i < moves.length; i++) {
    if (!moves[i].includes("I")) {
      let movePos = getMovePos(piece, moves[i]);



      if (!isLegalMove(piece, moves[i])) {
        continue;
      }
      drawMoveOverlay(movePos, checkMoveState(movePos, piece));
    } else {
      for (let j = 1; j <= 8; j++) {

        let moveTemp = moves[i].replaceAll("I", j);

        let movePos = getMovePos(piece, moveTemp);
        if (!checkMoveState(movePos, piece)) {
          break;
        }
        if (!movePos || leadsToCheck(piece, moveTemp)) {
          continue;
        }
        drawMoveOverlay(movePos, checkMoveState(movePos, piece));
        if (checkMoveState(movePos, piece) == "take") {
          break;
        }
      }
    }
  }
}

function checkMoveState(movePos, piece) {
  if (movePos == enPassentChance && piece.name == "Pawn") {
    return "take";
  }
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].pos == movePos) {
      if (pieces[i].color == piece.color) {
        return false;
      } else {
        return "take";
      }
    }
  }
  return "move";
}

function getMovePos(piece, move) {
  newPos = (String)(piece.pos);
  move = (String)(move);
  if (move.includes("U")) {
    if (parseInt(newPos.charAt(1)) - parseInt(move.charAt((move.indexOf("U") - 1))) <= 0) {
      return false;
    }

    newPos = newPos.charAt(0) + (parseInt(newPos.charAt(1)) - parseInt(move.charAt((move.indexOf("U") - 1))));
  }
  if (move.includes("D")) {

    if (parseInt(newPos.charAt(1)) + parseInt(move.charAt((move.indexOf("D") - 1))) >= 9) {
      return false;
    }

    newPos = newPos.charAt(0) + (parseInt(newPos.charAt(1)) + parseInt(move.charAt((move.indexOf("D") - 1))));
  }
  if (move.includes("L")) {

    if ((parseInt(newPos.charAt(0)) - parseInt(move.charAt((move.indexOf("L") - 1)))) <= 0) {
      return false;
    }

    newPos = (parseInt(newPos.charAt(0)) - parseInt(move.charAt((move.indexOf("L") - 1)))) + newPos.charAt(1);
  }
  if (move.includes("R")) {

    if ((parseInt(newPos.charAt(0)) + parseInt(move.charAt((move.indexOf("R") - 1)))) >= 9) {
      return false;
    }

    newPos = (parseInt(newPos.charAt(0)) + parseInt(move.charAt((move.indexOf("R") - 1)))) + newPos.charAt(1);
  }
  return newPos;
}


function drawMoveOverlay(pos, type) {
  if (type == "move") {
    let div = document.createElement("div");
    div.className = "overlayCircle";
    div.style.gridColumn = pos.charAt(0);
    div.style.gridRow = pos.charAt(1);
    document.getElementById("overlay").appendChild(div)
  } else if (type == "take") {
    let div = document.createElement("div");
    div.className = "overlayTake";
    div.style.gridColumn = pos.charAt(0);
    div.style.gridRow = pos.charAt(1);
    document.getElementById("overlay").appendChild(div)
  } else if (type == "rochade") {
    let div = document.createElement("div");
    div.className = "overlayRochade";
    div.style.gridColumn = pos.charAt(0);
    div.style.gridRow = pos.charAt(1);
    document.getElementById("overlay").appendChild(div)

  }
}

function leadsToCheck(piece, move) {
  movePos = getMovePos(piece, move);
  if (piece.name == "Pawn" && !move.includes("/")) {
    for (let i = 0; i < pieces.length; i++) {
      if (movePos == piece.pos) return false;
    }
  }
  piecesTemp = JSON.parse(JSON.stringify(pieces))
  if (isFreesquare(movePos)) {
    for (let i = 0; i < piecesTemp.length; i++) {
      if (piecesTemp[i].pos == piece.pos) {
        piecesTemp[i].pos = movePos;
      }
    }
  } else {
    let wasPlaced = false;
    for (let i = 0; i < piecesTemp.length; i++) {
      if (piecesTemp[i].pos == movePos) {
        piecesTemp[i] = JSON.parse(JSON.stringify(piece));
        piecesTemp[i].pos = movePos;
        wasPlaced = true;
      }
    }
    if (wasPlaced) {
      for (let i = 0; i < piecesTemp.length; i++) {
        if (piecesTemp[i].pos == piece.pos) {
          piecesTemp.splice(i, 1);
        }
      }
    }
  }
  tempColor = piece.color;
  for (let i = 0; i < piecesTemp.length; i++) {
    if (piecesTemp[i].name == "King" && piecesTemp[i].color == tempColor) {
      king = piecesTemp[i];
    }
  }
  for (let i = 0; i < piecesTemp.length; i++) {
    if (piecesTemp[i].color != tempColor) {
      let moves = piecesTemp[i].moves;
      for (let j = 0; j < moves.length; j++) {
        if (!moves[j].includes("I")) {
          if (piecesTemp[i].name == "Pawn" && !moves[j].includes("/")) continue;
          let movePos = getMovePos(piecesTemp[i], moves[j]);
          if (movePos == king.pos) {
            return true;
          }
        } else {
          for (let k = 1; k <= 8; k++) {
            let moveTemp = moves[j].replaceAll("I", k)
            let movePos = getMovePos(piecesTemp[i], moveTemp);
            if (movePos == king.pos) {
              if (!isBlocked(moves[j], piecesTemp[i], king.pos, piecesTemp)) return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function isBlocked(move, posPiece, endPiecepos, piecesTemp) {
  if (!posPiece.moves[0].includes("I")) {
    return posPiece.color == curColor;
  }
  move = (String)(move);
  for (let k = 1; k <= 8; k++) {
    let moveTemp = move.replaceAll("I", k)
    let movePos = getMovePos(posPiece, moveTemp);
    if (movePos == endPiecepos) {
      return false;
    }
    for (let i = 0; i < piecesTemp.length; i++) {
      if (piecesTemp[i].pos == movePos) {
        return true;
      }
    }
  }
  return false;
}

function isFreesquare(pos) {
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].pos == pos) return false;
  }
  return true;
}

function isLegalMove(piece, move, infinite) {

  let movePos = getMovePos(piece, move);

  if (!infinite) {
    if (piece.name == "Pawn" && !piece.firstMove && move.includes("2")) {
      return false;
    }

    if (piece.name == "Pawn" && move.includes("/")) {
      let canContinue = false;
      for (let j = 0; j < pieces.length; j++) {
        if (pieces[j].pos == getMovePos(piece, move) || (enPassentChance == getMovePos(piece, move) && enPassentColor != piece.color)) {
          canContinue = true;
        }
      }
      if (!canContinue) {
        return false;
      }
    } else if (piece.name == "Pawn" && !move.includes("/")) {
      let canContinue = true;
      for (let j = 0; j < pieces.length; j++) {
        if (pieces[j].pos == getMovePos(piece, move)) {
          canContinue = false;
        }
      }
      if (!canContinue) {
        return false;
      }
    }
    if (piece.name == "Pawn" && move.includes("2")) {
      for (let j = 0; j < pieces.length; j++) {
        if (pieces[j].pos == getMovePos(piece, moves[0])) {
          return false;
        }
      }
    }

    if (piece.name == "Pawn" && checkMoveState(movePos, piece) == "take" && (move == "1D" || move == "1U")) {
      return false;
    }

    if (!movePos || leadsToCheck(piece, move)) {
      return false;
    }

    if (!checkMoveState(movePos, piece)) {
      return false;
    }
    return true;
  } else {

  }
}

function getGameState() {
  //0 kein Checkmate, 1 Checkmate, 2 Patt
  for (let i = 0; i < pieces.length; i++) {
    moves = pieces[i].moves;
    for (let j = 0; j < moves.length; j++) {
      if (isLegalMove(pieces[i], moves[j]) && pieces[i].color == curColor) {
        return 0;
      }
    }
  }
  return isKingChecked() ? 1 : 2;
}

function isKingChecked() {
  tempColor = curColor;
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].name == "King" && pieces[i].color == tempColor) {
      king = pieces[i];
    }
  }
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].color != tempColor) {
      let moves = pieces[i].moves;
      for (let j = 0; j < moves.length; j++) {
        if (!moves[j].includes("I")) {
          if (pieces[i].name == "Pawn" && !moves[j].includes("/")) continue;
          let movePos = getMovePos(pieces[i], moves[j]);
          if (movePos == king.pos) {
            return true;
          }
        } else {
          for (let k = 1; k <= 8; k++) {
            let moveTemp = moves[j].replaceAll("I", k)
            let movePos = getMovePos(pieces[i], moveTemp);
            if (movePos == king.pos) {
              if (!isBlocked(moves[j], pieces[i], king.pos, pieces)) return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function isFieldChecked(kingPos) {
  tempColor = curColor;

  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].color != tempColor) {
      let moves = pieces[i].moves;
      for (let j = 0; j < moves.length; j++) {
        if (!moves[j].includes("I")) {
          if (pieces[i].name == "Pawn" && !moves[j].includes("/")) continue;
          let movePos = getMovePos(pieces[i], moves[j]);
          if (movePos == kingPos) {
            return true;
          }
        } else {
          for (let k = 1; k <= 8; k++) {
            let moveTemp = moves[j].replaceAll("I", k)
            let movePos = getMovePos(pieces[i], moveTemp);
            if (movePos == kingPos) {
              if (!isBlocked(moves[j], pieces[i], kingPos, pieces)) return true;
            }
          }
        }
      }
    }
  }
  return false;
}

function canRochade() {
  //-1 can not rochade, 8 kingSide, 1 queenSide
  if (isKingChecked()) return false;
  let kingSide = true;
  let queenSide = true;
  let rochadeArray = [];
  if (curColor == "White") {
    if (whiteMovedPiecesRochade[0]) return false;
    if (!isFreesquare("68") || !isFreesquare("78") || whiteMovedPiecesRochade[2] || isFieldChecked("68") || isFieldChecked("78")) kingSide = false;
    if (!isFreesquare("28") || !isFreesquare("38") || !isFreesquare("48") || whiteMovedPiecesRochade[1] || isFieldChecked("28") || isFieldChecked("38") || isFieldChecked("48")) queenSide = false;

    if (kingSide) rochadeArray[0] = 8;
    if (queenSide) rochadeArray[1] = 1;

    if (rochadeArray.length == 0) return false;
    return rochadeArray;
  } else {
    if (blackMovedPiecesRochade[0]) return false;
    if (!isFreesquare("61") || !isFreesquare("71") || blackMovedPiecesRochade[2] || isFieldChecked("61") || isFieldChecked("71")) kingSide = false;
    if (!isFreesquare("21") || !isFreesquare("31") || !isFreesquare("41") || blackMovedPiecesRochade[1] || isFieldChecked("21") || isFieldChecked("31") || isFieldChecked("41")) queenSide = false;

    if (kingSide) rochadeArray[0] = 8;
    if (queenSide) rochadeArray[1] = 1;

    if (rochadeArray.length == 0) return false;
    return rochadeArray;
  }
}

function hasPawnReachedEnd(piece) {
  return piece.name == "Pawn" && (piece.pos.charAt(1) == '8' || piece.pos.charAt(1) == '1');
}

let listeners = [];
function promotePawn(piece) {
  blocked = true;
  let menu;
  if (piece.color == "White") {
    menu = document.getElementsByClassName("whiteMenu")[0];

    //menu.style.marginLeft = "calc(30vw + " + ((piece.pos.charAt(0) - 1) + 0.5) * chessboard.offsetWidth / 8 + "px)";
  } else {
    menu = document.getElementsByClassName("blackMenu")[0];


    //menu.style.marginRight = "calc(30vw + 40vw / 8 * " + (((piece.pos.charAt(0) - 1)) - 0.5) + ")";
  }
  menu.style.marginLeft = "calc(30vw + 40vw / 8 * " + ((piece.pos.charAt(0) - 1) + 0.5) + ")";
  menu.style.display = "block";

  for (let i = 0; i < menu.childNodes.length; i++) {
    menu.childNodes[i].addEventListener("click", function () {
      for (let j = 0; j < pieces.length; j++) {
        if (pieces[j] == piece) {
          if (i == 1) pieces[j] = new Bishop(piece.pos, piece.color);
          if (i == 3) pieces[j] = new Knight(piece.pos, piece.color);
          if (i == 5) pieces[j] = new Queen(piece.pos, piece.color);
          if (i == 7) pieces[j] = new Rook(piece.pos, piece.color);
        }
        drawPieces();
        blocked = false;
      }

      menu.style.display = "none";
    })
  }
}

function showWinscreen(color) {
  if (color == "Patt") {
    document.getElementById("infotext").innerText = color + "!"
  } else {
    document.getElementById("infotext").innerText = color + " wins!";
  }
  document.getElementById("blur").style.filter = "blur(5px) brightness(90%)";
  let win = document.getElementById("win");
  win.style.display = "flex";
}


function drawTaken(piece) {
  let taken = document.getElementById("taken" + piece.color);
  let takenDiv = document.createElement("div");
  takenDiv.className = "takenDiv";

  takenDiv.style.backgroundImage = "url(img/chess/" + piece.name + piece.color + ".png)";
  console.log(taken, takenDiv)
  taken.appendChild(takenDiv);
}

function getOppositeColor(color) {
  return color == "White" ? "Black" : "White";
}