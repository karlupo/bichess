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
let chessboard=document.getElementById("chessboard");
let clicked = false;

let curStyle = 0;
let tilesColors = ["rgb(182,148,110)", "rgb(255,241,220)", "rgb(80, 42, 4)", "rgb(255,241,220)"];

chessboard.addEventListener("contextmenu", drawArrow);
chessboard.addEventListener("click", movePiece)

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

document.getElementById("styles").addEventListener("change", function(){
  curStyle = parseInt(document.getElementById("styles").value)
  console.log(curStyle)
  drawboard();
})


chessboard.addEventListener("mousemove", function(e){
  if(clicked){
    var x = e.clientX;
    var y = e.clientY;
 
    curClickedDiv.style.left = x - 57.5+ "px";
    curClickedDiv.style.top = y -60+ "px";
    console.log(curClickedDiv.style.left)
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

    fig.addEventListener("pointerdown", function(){
      getAvailableMoves(pieces[i], fig);
      clicked = true;
    })

    document.getElementById("figures").appendChild(fig)
  }
  
}

function drawboard() {
  let childs = chessboard.childNodes
  while (chessboard.childNodes.length > 4) {
    console.log(chessboard.lastChild.id)
    if(chessboard.lastChild.id != "figures" && chessboard.lastChild.id != "overlay"){
      chessboard.removeChild(chessboard.lastChild);
    }
}
  //Draw Chessboard Tiles
  for (let i = 0; i < 64; i++) {
    let div = document.createElement("div");
    
    if (i % 16 < 8) {
      if (i % 2 == 0) {
        div.style.backgroundColor = tilesColors[curStyle];
      } else {
        div.style.backgroundColor = tilesColors[curStyle + 1];
      }
    } else {
      if (i % 2 != 0) {
        div.style.backgroundColor = tilesColors[curStyle];
      } else {
        div.style.backgroundColor = tilesColors[curStyle + 1];
      }
    }
    
    chessboard.appendChild(div);
  }
}



function movePiece(event){
  let overlays = document.querySelector("#overlay").childNodes
  let clicked = getTile(event);


  for(let i = 0; i < overlays.length; i++){
    if(clicked.row.toString() == overlays[i].style.gridRow.charAt(0) && clicked.column.toString() == overlays[i].style.gridColumn.charAt(0)){
      for(let j = 0; j<pieces.length; j++){
        if(pieces[j] == curclicked){
          pieces[j].pos = overlays[i].style.gridColumn.charAt(0) + overlays[i].style.gridRow.charAt(0);
          if(pieces[j].name == "Pawn"){
            pieces[j].firstMove = false;
          }
          if(curColor == "White"){
            curColor = "Black"
          }else{
            curColor = "White";
          }
          document.getElementById("overlay").innerHTML = "";
          console.log(pieces[j])
          for(let k = 0; k < pieces.length; k++){
            console.log(pieces[k] + "|" +  pieces[j])
            if(pieces[k].pos == pieces[j].pos && pieces[j] != pieces[k]){
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

function getAvailableMoves(piece, fig){

  if(piece.color != curColor){
    return;
  }

  curclicked = piece
  curClickedDiv = fig
  moves = piece.moves;
  
  document.getElementById("overlay").innerHTML = "";
  for(let i = 0; i < moves.length; i++){
    if(!moves[i].includes("I")){
      let movePos = getMovePos(piece, moves[i]);
      
      if(piece.name == "Pawn" && !piece.firstMove && moves[i].includes("2")){
        continue;
      }

      if(piece.name == "Pawn" && moves[i].includes("/")){
        let canContinue = false;
        for(let j = 0; j < pieces.length; j++){
          if(pieces[j].pos == getMovePos(piece, moves[i])){
            canContinue = true;
          }
        }
        if(!canContinue){
          continue;
        }
      }

      if(piece.name == "Pawn" && checkMoveState(movePos, piece) == "take" && (moves[i] == "1D" || moves[i] == "1U")){
        continue;
      }

      if(!movePos){
        continue;
      }

      if(!checkMoveState(movePos, piece)){
        continue;
      }
      

      drawMoveOverlay(movePos, checkMoveState(movePos, piece));
    }else{
      for(let j = 1; j<=8; j++){
        
        let moveTemp = moves[i].replaceAll("I", j)
        

        let movePos = getMovePos(piece, moveTemp);
        if(!movePos){
          continue;
        }


        if(!checkMoveState(movePos, piece)){
          break;
        }
        drawMoveOverlay(movePos, checkMoveState(movePos, piece));
        if(checkMoveState(movePos, piece) == "take"){
          break;
        }
      }
    }
  }
}

function checkMoveState(movePos, piece){
  for(let i = 0; i < pieces.length; i++){
    if(pieces[i].pos == movePos){
      if(pieces[i].color == piece.color){
        return false;
      }else {
        return "take";
      }
    }
  }
  return "move";
}

function getMovePos(piece, move){
  newPos = piece.pos;
  if(move.includes("U")){
    if(parseInt(newPos.charAt(1)) - parseInt(move.charAt((move.indexOf("U") - 1))) <= 0){
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



