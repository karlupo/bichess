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
  new Rook("81", "Black"),
];
let chessboard=document.getElementById("chessboard");
chessboard.addEventListener("contextmenu", drawArrow);

drawboard();
drawPieces();

function drawArrow(event) {
  event.preventDefault();
  
  console.log(getTile(event).row);
}



function getTile(event){
  let column=(event.clientX - chessboard.getBoundingClientRect().left)/100;
  let row=(event.clientY - chessboard.getBoundingClientRect().top)/100;
  return{column:Math.ceil(column), row: Math.ceil(row) };
}

//Draw

function drawPieces() {
  for (let i = 0; i < pieces.length; i++) {
    let fig = document.createElement("div");
    fig.className = "figure";
    fig.style.backgroundImage =
      "url('../img/" + pieces[i].name + pieces[i].color + ".png')";

    fig.style.gridColumn = parseInt(pieces[i].pos.charAt(0));
    fig.style.gridRow = parseInt(pieces[i].pos.charAt(1));

    fig.addEventListener("click", function(){
      getAvailableMoves(pieces[i]);
    })

    document.getElementById("figures").appendChild(fig)
  }
  
}

function drawboard() {
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
    
    chessboard.appendChild(div);
  }
}





function getAvailableMoves(piece){
  moves = piece.moves;
  
  document.getElementById("overlay").innerHTML = "";
  parent: for(let i = 0; i < moves.length; i++){
    if(!moves[i].includes("I")){
      let movePos = getMovePos(piece, moves[i]);
      if(!movePos){
        continue;
      }

      for(let i = 0; i < pieces.length; i++){
        if(pieces[i].color == piece.color){
          if(pieces[i].pos == movePos){
            continue parent;
          }
        }
      }
      drawMoveOverlay(movePos, "move");
    }
  }
}

function getMovePos(piece, move){
  newPos = piece.pos;
  if(move.includes("U")){
    if(parseInt(newPos.charAt(1)) - parseInt(move.charAt((move.indexOf("U") - 1))) <= 1){
      return false;
    }

    newPos = newPos.charAt(0) + (parseInt(newPos.charAt(1)) - parseInt(move.charAt((move.indexOf("U") - 1))));
  }
  if(move.includes("D")){

    if(parseInt(newPos.charAt(1)) + parseInt(move.charAt((move.indexOf("D") - 1))) >= 9){
      return false;
    }

    newPos = newPos.charAt(0) + (parseInt(newPos.charAt(1)) + parseInt(move.charAt((move.indexOf("D") - 1))));
  }
  if(move.includes("L")){

    if((parseInt(newPos.charAt(0)) - parseInt(move.charAt((move.indexOf("L") - 1)))) <= 0){
      return false;
    }

    newPos = (parseInt(newPos.charAt(0)) - parseInt(move.charAt((move.indexOf("L") - 1)))) + newPos.charAt(1);
  }
  if(move.includes("R")){

    if((parseInt(newPos.charAt(0)) + parseInt(move.charAt((move.indexOf("R") - 1)))) >= 9){
      return false;
    }

    newPos = (parseInt(newPos.charAt(0)) + parseInt(move.charAt((move.indexOf("R") - 1)))) + newPos.charAt(1);
  }
  return newPos;
}


function drawMoveOverlay(pos, type){
  if(type == "move"){
    let div = document.createElement("div");
    div.className = "overlayCircle";
    div.style.gridColumn = pos.charAt(0);
    div.style.gridRow = pos.charAt(1);
    document.getElementById("overlay").appendChild(div)
  }else if(type == "take"){
    let div = document.createElement("div");
    div.className = "overlayTake";
    div.style.gridColumn = pos.charAt(0);
    div.style.gridRow = pos.charAt(1);
    document.getElementById("overlay").appendChild(div)
  }
}



