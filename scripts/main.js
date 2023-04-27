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

let curStyle = 0;
let tilesColors = ["rgb(182,148,110)", "rgb(255,241,220)", "rgb(80, 42, 4)", "rgb(255,241,220)"];

chessboard.addEventListener("mousedown", drawArrow);
chessboard.addEventListener("click", movePiece);
chessboard.addEventListener("mouseup", finisharrow);
chessboard.addEventListener("contextmenu", function (event) {
  event.preventDefault();
})

drawboard();
drawPieces();


//Draw Arrow
let startedX = -1;
let startedY = -1;
let canvas = document.getElementById('myCanvas');
canvas.width = 800;
canvas.height = 800;
let ctx = canvas.getContext('2d');
ctx.strokeStyle = "rgba(255, 175, 0, 0.7)";
ctx.lineWidth = 20;



function drawArrow(event) {


  if (event.button == 2) {

    let x = getTile(event).column * 100 - 50 + 2;
    let y = getTile(event).row * 100 - 50 + 2;
    ctx.beginPath();

    ctx.moveTo(getTile(event).column * 100 - 50 + 2, getTile(event).row * 100 - 50 + 2)

    startedX = getTile(event).column;
    startedY = getTile(event).row;
  }



}



function finisharrow(event) {
  if (startedX != -1 && event.button == 2) {

    let x = getTile(event).column * 100 - 50 + 2;
    let y = getTile(event).row * 100 - 50 + 2;

    if (Math.abs(startedX - getTile(event).column) == 1 && Math.abs(startedY - getTile(event).row) == 2) {
      ctx.lineTo(startedX * 100 - 50 + 2, y);
      if (startedX * 100 - 50 + 2 > x) {
        ctx.lineTo(x + 50, y);
      } else {
        ctx.lineTo(x - 50, y);
      }
      ctx.stroke();
      ctx.closePath();
      if (startedX * 100 - 50 + 2 > x) {
        drawArrowHead(x, y, 0);
      } else {
        drawArrowHead(x, y, Math.PI);
      }

    } else if (Math.abs(startedX - getTile(event).column) == 2 && Math.abs(startedY - getTile(event).row) == 1) {
      ctx.lineTo(x, startedY * 100 - 50 + 2);
      if (startedY * 100 - 50 + 2 > y) {
        ctx.lineTo(x, y + 50);
      } else {
        ctx.lineTo(x, y - 50);
      }
      ctx.stroke();
      ctx.closePath();
      if (startedY * 100 - 50 + 2 > y) {
        drawArrowHead(x, y, Math.PI / 2);
      } else {
        drawArrowHead(x, y, Math.PI * 3 / 2);
      }

    } else {
      let angle = calcAngle(startedX * 100 - 50 + 2, startedY * 100 - 50 + 2, getTile(event).column * 100 - 50 + 2, getTile(event).row * 100 - 50 + 2);
      let length = Math.sqrt(Math.pow(startedX * 100 - 50 + 2 - x, 2) + Math.pow(startedY * 100 - 50 + 2 - y, 2));

      x = startedX * 100 - 50 + 2 - Math.cos(angle) * (length - 50);
      y = startedY * 100 - 50 + 2 - Math.sin(angle) * (length - 50);

      ctx.lineTo(x, y);

      ctx.closePath();
      if (startedX != getTile(event).column || startedY != getTile(event).row) {
        ctx.stroke();
        drawArrowHead(getTile(event).column * 100 - 50 + 2, getTile(event).row * 100 - 50 + 2, angle);

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
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(40, 20);
  ctx.lineTo(40, 10);
  ctx.lineTo(50, 10);
  ctx.lineTo(50, -10);
  ctx.lineTo(40, -10);
  ctx.lineTo(40, -20);
  ctx.closePath();
  ctx.restore();
  ctx.fillStyle = "rgba(255, 175, 0, 0.7)";
  ctx.fill();

}

/*  
  removeArrow();
  event.preventDefault();
  let arrowNeck = document.createElement("img");
  arrowNeck.src = "../img/Arrow-neck.png";
  arrowNeck.className = "arrow";
  arrowNeck.style.margin = "0px 0px 0px 0px";
  arrowNeck.style.transform = "rotate(10deg)"
  arrowNeck.style.gridColumn = getTile(event).column;
  arrowNeck.style.gridRow = getTile(event).row;
  arrowNeck.style.width = "100px";
  document.getElementById("figures").appendChild(arrowNeck);
*/

function removeArrow() {
  removeChildren("figures", "arrow");
}


function getTile(event) {
  let column = (event.clientX - chessboard.getBoundingClientRect().left) / 100;
  let row = (event.clientY - chessboard.getBoundingClientRect().top) / 100;
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

document.getElementById("styles").addEventListener("change", function () {
  curStyle = parseInt(document.getElementById("styles").value)
  drawboard();
})

let tempX = 0;
let tempY = 0;

document.addEventListener("scroll", (event) => {
  if (clicked) {
    curClickedDiv.style.left = (tempX - 57.5 + window.pageXOffset) + "px";
    curClickedDiv.style.top = (tempY - 60 + window.pageYOffset) + "px";
    curClickedDiv.style.gridColumn = "";
    curClickedDiv.style.gridRow = "";
    curClickedDiv.style.zIndex = "999";
  }
});

chessboard.addEventListener("mousemove", function (e) {
  if (clicked) {
    var x = e.clientX;
    var y = e.clientY;
    tempX = x;
    tempY = y;
    curClickedDiv.style.left = (x - 57.5 + window.pageXOffset) + "px";
    curClickedDiv.style.top = (y - 60 + window.pageYOffset) + "px";
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
      "url('../img/" + pieces[i].name + pieces[i].color + ".png')";

    fig.style.gridColumn = parseInt(pieces[i].pos.charAt(0));
    fig.style.gridRow = parseInt(pieces[i].pos.charAt(1));

    fig.addEventListener("pointerdown", function (event) {
      if (event.button != 0) {
        return;
      }
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


  for (let i = 0; i < overlays.length; i++) {
    if (clicked.row.toString() == overlays[i].style.gridRow.charAt(0) && clicked.column.toString() == overlays[i].style.gridColumn.charAt(0)) {
      for (let j = 0; j < pieces.length; j++) {
        if (pieces[j] == curclicked) {
          pieces[j].pos = overlays[i].style.gridColumn.charAt(0) + overlays[i].style.gridRow.charAt(0);
          if (pieces[j].name == "Pawn") {
            pieces[j].firstMove = false;
          }
          if (curColor == "White") {
            curColor = "Black"
          } else {
            curColor = "White";
          }
          document.getElementById("overlay").innerHTML = "";

          for (let k = 0; k < pieces.length; k++) {

            if (pieces[k].pos == pieces[j].pos && pieces[j] != pieces[k]) {
              pieces.splice(k, 1);
              break;
            }
          }
        }
      }
    }
  }
  drawPieces();
}

function getAvailableMoves(piece, fig) {

  if (piece.color != curColor) {
    return;
  }

  curclicked = piece
  curClickedDiv = fig
  moves = piece.moves;

  document.getElementById("overlay").innerHTML = "";
  for (let i = 0; i < moves.length; i++) {
    if (!moves[i].includes("I")) {
      let movePos = getMovePos(piece, moves[i]);

      if (piece.name == "Pawn" && !piece.firstMove && moves[i].includes("2")) {
        continue;
      }



      if (piece.name == "Pawn" && moves[i].includes("/")) {
        let canContinue = false;
        for (let j = 0; j < pieces.length; j++) {
          if (pieces[j].pos == getMovePos(piece, moves[i])) {
            canContinue = true;
          }
        }
        if (!canContinue) {
          continue;
        }
      }

      if (piece.name == "Pawn" && checkMoveState(movePos, piece) == "take" && (moves[i] == "1D" || moves[i] == "1U")) {
        continue;
      }

      if (!movePos || !isLegalMove(piece, movePos)) {
        continue;
      }

      if (!checkMoveState(movePos, piece)) {
        continue;
      }


      drawMoveOverlay(movePos, checkMoveState(movePos, piece));
    } else {
      for (let j = 1; j <= 8; j++) {

        let moveTemp = moves[i].replaceAll("I", j)


        let movePos = getMovePos(piece, moveTemp);
        if (!movePos || !isLegalMove(piece, movePos)) {
          continue;
        }


        if (!checkMoveState(movePos, piece)) {
          break;
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
  }
}

function isLegalMove(piece, movePos) {
  piecesTemp = JSON.parse(JSON.stringify(pieces))
  for(let i = 0; i < pieces.length; i++){
    if(pieces[i].pos == movePos) {
      piecesTemp.splice(i, 1);
    }
    if(pieces[i] == piece) {
      piecesTemp[i].pos = movePos;
    }
  }
  tempColor = piece.color;
  console.log(tempColor)
  for (let i = 0; i < piecesTemp.length; i++) {
    if (piecesTemp[i].name == "King" && piecesTemp[i].color == tempColor) {
      kingPos = piecesTemp[i].pos;
    }
  }
  for (let i = 0; i < piecesTemp.length; i++) {
    if (piecesTemp[i].color != tempColor) {
      let moves = piecesTemp[i].moves;
      for (let j = 0; j < moves.length; j++) {
        if (!moves[j].includes("I")) {
          if(piecesTemp[i].name == "Pawn" && !moves[j].includes("/")) continue;
          let movePos = getMovePos(piecesTemp[i], moves[j]);
          if (movePos == kingPos) {
            return false;
          }
        } else {
          for (let k = 1; k <= 8; k++) {
            let moveTemp = moves[j].replaceAll("I", k)
            let movePos = getMovePos(piecesTemp[i], moveTemp);
            if (movePos == kingPos) {
              if(!isBlocked(moves[j], piecesTemp[i], kingPos, piecesTemp)) return false;
            }
          }
        }
      }
    }
  }
  return true;
}

function isBlocked(move, posPiece, endPos, piecesTemp) {
  for (let k = 1; k <= 8; k++) {
    let moveTemp = move.replaceAll("I", k)
    let movePos = getMovePos(posPiece, moveTemp);
    if (movePos == endPos) {
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


