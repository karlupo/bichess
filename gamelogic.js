

//Die Verfügbaren Moves:

//Erstes "Argument" steht dafür wohin er moven kann. Bsp. 1Down --> ein Feld Nach Unten (I statt der Zahl steht für Unendlich viele in diese Richtung)
// Zweites "Argument" steht für die Bedingung, wann das pasieren darf Bsp: Capture, wenn er auf diesem Feld jemanden Capturen kann

const movesWhite = [
    ["Pawn", [["1Up", "Normal"], ["2Up", "Start"], ["1Up/1Left", "Capture"], ["1Up/1Right", "Capture"]]],
    ["Horse", [["2Down/1Left", "Normal"], ["2Down/1Right", "Normal"], ["2Up/1Right", "Normal"], ["2Up/1Left", "Normal"], ["1Up/2Left", "Normal"], ["1Up/2Right", "Normal"], ["1Down/2Left", "Normal"], ["1Down/2Right", "Normal"]]],
    ["Queen", [["ILeft", "Normal"], ["IRight", "Normal"], ["IUp", "Normal"],["IDown", "Normal"], ["IRightDown", "Normal"], ["IRightUp", "Normal"], ["ILeftDown", "Normal"], ["ILeftUp", "Normal"]]],
    ["Bishop", [["ILeftDown", "Normal"], ["ILeftUp", "Normal"], ["IRightDown", "Normal"], ["IRightUp", "Normal"]]],
    ["Rook", [["IUp", "Normal"], ["IDown", "Normal"], ["ILeft", "Normal"], ["IRight", "Normal"]]],
    ["King", [["1Down", "Normal"], ["1Up", "Normal"], ["1Left", "Normal"], ["1Right", "Normal"], ["1Right/1Up", "Normal"], ["1Left/1Up", "Normal"], ["1Right/1Down", "Normal"], ["1Left/1Down", "Normal"]]]
]

const movesBlack = [
    ["Pawn", [["1Down", "Normal"], ["2Down", "Start"], ["1Down/1Left", "Capture"], ["1Down/1Right", "Capture"]]],
    ["Horse", [["2Down/1Left", "Normal"], ["2Down/1Right", "Normal"], ["2Up/1Right", "Normal"], ["2Up/1Left", "Normal"], ["1Up/2Left", "Normal"], ["1Up/2Right", "Normal"], ["1Down/2Left", "Normal"], ["1Down/2Right", "Normal"]]],
    ["Queen", [["ILeft", "Normal"], ["IRight", "Normal"], ["IUp", "Normal"],["IDown", "Normal"], ["IRightDown", "Normal"], ["IRightUp", "Normal"], ["ILeftDown", "Normal"], ["ILeftUp", "Normal"]]],
    ["Bishop", [["ILeftDown", "Normal"], ["ILeftUp", "Normal"], ["IRightDown", "Normal"], ["IRightUp", "Normal"]]],
    ["Rook", [["IUp", "Normal"], ["IDown", "Normal"], ["ILeft", "Normal"], ["IRight", "Normal"]]],
    ["King", [["1Down", "Normal"], ["1Up", "Normal"], ["1Left", "Normal"], ["1Right", "Normal"], ["1Right/1Up", "Normal"], ["1Left/1Up", "Normal"], ["1Right/1Down", "Normal"], ["1Left/1Down", "Normal"]]]
]

const values = [["Pawn", 1], ["Horse", 3], ["Bishop", 3], ["Rook", 5], ["Queen", 9]];
const blackImg = [["Pawn", "♟︎"], ["Horse", "♞"], ["Bishop", "♝"], ["Rook", "♜"], ["Queen", "♛"]];
const whiteImg = [["Pawn", "♙"], ["Horse", "♘"], ["Bishop", "♗"], ["Rook", "♖"], ["Queen", "♕"]];

let blackScore = 0;
let whiteScore = 0;

let firstClick = true;
let clicked;

let myColor = "White";

//Wenn auf Figur geklickt wird handeln
function handleClickFigures(){
    for(let i = 0; i < piecesDivs.length; i++){
        if(piecesDivs[i] == undefined) continue;
        piecesDivs[i].addEventListener('click', function(){
            if(pieces[i][1].includes(myColor)){
                drawPieces();
                getAvailableMoves(pieces[i]);
            }
        })
    }
}

let defetedPos = "h9";

document.getElementById("chessboard").addEventListener("click", function(){

    if(overlay[0] == undefined) return;

    let offset = document.getElementById("chessboard").getBoundingClientRect();
 
    //damit können wir die Koordinaten "umrechnen"
    let xRel = event.clientX - offset.left;
    let yRel = event.clientY - offset.top;


    for(let i = 0; i < overlay.length; i++){
        if(overlay[i] == undefined) break;
        
        
        let row = overlay[i].style.gridRow;
        let col = overlay[i].style.gridColumn;
        


        if(col.charAt(0) == Math.floor(xRel / 80) + 1 && row.charAt(0) == Math.floor(yRel / 80) + 1){
            for(let j = 0; j < pieces.length; j++){
                if(pieces[j] == clicked){

                    pieces[j][0] = String.fromCharCode(105 - parseInt(col.charAt(0))) + row.charAt(0);

                    if(overlay[i].className == "overlayTakeCirlce"){
                        for(let k = 0; k < pieces.length; k++){
                            if(pieces[k][0] == pieces[j][0] && pieces[k][1] != pieces[j][1]){

                                let imgs;

                                let pieceName; 
                                if(pieces[k][1].indexOf("White") == -1){
                                    pieceName = pieces[k][1].substring(0, pieces[k][1].indexOf("Black"));
                                }else{
                                    pieceName =  pieces[k][1].substring(0, pieces[k][1].indexOf("White"));
                                }

                                if(pieces[k][1].includes("Black")){
                                    imgs = blackImg;
                                }else{
                                    imgs = whiteImg;
                                }

                                for(let l = 0; l < imgs.length; l++){
                                    if (imgs[l][0] == pieceName){
                                        if(myColor == "Black"){
                                            blackScore += values[l][1];
                                            whiteScore -= values[l][1];
                                            document.getElementById("bCF").innerHTML = document.getElementById("bCF").innerHTML + imgs[l][1];
                                        }else{
                                            whiteScore += values[l][1];
                                            blackScore -= values[l][1];
                                            document.getElementById("wCF").innerHTML = document.getElementById("wCF").innerHTML + imgs[l][1];
                                        }

                                        updateScore();
                                    }
                                }

                                pieces[k][0] = "z0"
                                document.getElementById("figures").removeChild(piecesDivs[k]);
                                piecesDivs[k] = undefined;
                            }
                        }
                    }
                    
                    if(row.substring(0, row.indexOf("/") - 1) == "1" && clicked[1].includes("Pawn")){
                        showSwapMenu(col);
                    }

                    
                    drawPieces();
                    if(myColor == "Black"){
                        myColor = "White";
                    }else{
                        myColor = "Black";
                    }
                    for(let i = 0; i < overlay.length; i++){
                        if(overlay[i] != undefined){
                            document.getElementById("overlay").removeChild(overlay[i]);
                        }
                    }
                    overlayCounter = 0;
                    overlay = new Array(32);
                }
            }
        }
        
    }

})

function updateScore(){
    if(blackScore > whiteScore){
        document.getElementById("capturedScoreBlack").innerHTML = "+" + blackScore;
        document.getElementById("capturedScoreWhite").innerHTML = "";
    }else if(whiteScore > blackScore){
        document.getElementById("capturedScoreWhite").innerHTML = "+" + whiteScore;
        document.getElementById("capturedScoreBlack").innerHTML = "";
    }else{
        document.getElementById("capturedScoreBlack").innerHTML = "";
        document.getElementById("capturedScoreWhite").innerHTML = "";
    }
}

handleClickFigures();


//Zeichnet die Moves, die Verfügbar sind
function getAvailableMoves(piece){

    clicked = piece;
    let pieceName; 
    let blackOrWhite = "White";
    if(piece[1].indexOf("White") == -1){
        pieceName = piece[1].substring(0, piece[1].indexOf("Black"));
        blackOrWhite = "Black";
    }else{
        pieceName = piece[1].substring(0, piece[1].indexOf("White"));
    }


    let moves;
    for(let i = 0; i < movesWhite.length; i++){
        if(movesWhite[i][0] == pieceName){
            if(blackOrWhite == "White"){
                moves = movesWhite[i][1];
            }else{
                moves = movesBlack[i][1];
            }
        }
    }

    //Overlay bei neuem Klick clearen
    if(!firstClick){
        for(let i = 0; i < overlay.length; i++){
            if(overlay[i] != undefined){
                document.getElementById("overlay").removeChild(overlay[i]);
            }
        }
        overlayCounter = 0;
        overlay = new Array(32);
    }else{
        firstClick = false;
    }

    
    //Die Verfügbaren Bewegunen bekommen und Zeichnen
    for(let i = 0; i < moves.length; i++){

        let amount = moves[i][0].split("/");

        if(moves[i][1] == "Start" && piece[0].charAt(1) == "2" && blackOrWhite == "Black"){
            let canMove = true;

            for(let j = 0; j < pieces.length; j++){
                if(pieces[j][0] == piece[0].charAt(0) + (parseInt(piece[0].charAt(1)) + 1)){
                console.log("asda")
                    canMove = false;
                }
            }
            if(canMove){
                drawMoveOverlay(piece[0].charAt(0) + (parseInt(piece[0].charAt(1)) + parseInt(moves[i][0].charAt(0))), piece)
            }
        }else if(moves[i][1] == "Start" && piece[0].charAt(1) == "7" && blackOrWhite == "White"){

            let canMove = true;

            for(let j = 0; j < pieces.length; j++){
                if(pieces[j][0] == piece[0].charAt(0) + (parseInt(piece[0].charAt(1)) - 1)){
                    canMove = false;
                }
            }
            if(canMove){
                drawMoveOverlay(piece[0].charAt(0) + (parseInt(piece[0].charAt(1)) - parseInt(moves[i][0].charAt(0))), piece)
            }
        }
        if(moves[i][1] == "Normal"){

            let movePos = piece[0];

            if(amount[0].charAt(0) != "I"){
                for(let j = 0; j < amount.length; j++){
                    movePos = getMovePos(amount[j], movePos);
                }
    
                if(movePos.charCodeAt(0) >= 97 && movePos.charCodeAt(0) <= 104 && parseInt(movePos.substring(1)) >= 1 && parseInt(movePos.substring(1)) <= 8){
                    //console.log(movePos)
                    drawMoveOverlay(movePos, piece);
                }
            }else{
                for(let j = 0; j < 8; j++){
                    movePos = getMovePos("1" + amount[0].substring(1), movePos);
                    if(movePos.charCodeAt(0) >= 97 && movePos.charCodeAt(0) <= 104 && parseInt(movePos.substring(1)) >= 1 && parseInt(movePos.substring(1)) <= 8){
                        if(drawMoveOverlay(movePos, piece)){
                            break;
                        }  
                    }
                }
            }
        
        }else if(moves[i][1] == "Capture" && piece[1].includes("Pawn")){
            let movePos = piece[0];
            let amount = moves[i][0].split("/");
            for(let j = 0; j < amount.length; j++){
                movePos = getMovePos(amount[j], movePos);
            }

            if(movePos.charCodeAt(0) >= 97 && movePos.charCodeAt(0) <= 104 && parseInt(movePos.substring(1)) >= 1 && parseInt(movePos.substring(1)) <= 8){
                for(let j = 0; j < pieces.length; j++){
                    if(pieces[j][0] == movePos){
                        if(!((piece[1].indexOf("White") != -1 && pieces[j][1].indexOf("White") != -1) || (piece[1].indexOf("Black") != -1 && pieces[j][1].indexOf("Black") != -1))) {
                            drawMoveOverlay(movePos, piece, true);
                        }
                    }
                }
            }

        }
    }

}


function getMovePos(amount, curMovePos){
    let movePos = curMovePos;
    if(amount.includes("Down")){
        movePos = movePos.charAt(0) + (parseInt(movePos.substring(1)) + parseInt(amount.charAt(0)));
    }
    if(amount.includes("Left")){
        movePos = String.fromCharCode(movePos.charCodeAt(0) + parseInt(amount.charAt(0))) + movePos.substring(1);
    }
    if(amount.includes("Right")){
        movePos = String.fromCharCode(movePos.charCodeAt(0) - parseInt(amount.charAt(0))) + movePos.substring(1);
    }
    if(amount.includes("Up")){
        movePos = movePos.charAt(0) + (parseInt(movePos.substring(1)) - parseInt(amount.charAt(0)));
    }
    return movePos;
}


function showSwapMenu(col){

    let clr = myColor;
    let swapMenuOverlay = document.getElementById("swapOverlay");
    swapMenuOverlay.style.display = "block";
    swapMenuOverlay.className = "show";

    let swapMenu = document.getElementById("swapMenu");
    swapMenu.className = "show";
    swapMenu.style.marginLeft = ((parseInt(col.substring(0, col.indexOf("/")- 1)) - 1) * 80) + "px";

    if(myColor == "Black"){
        document.getElementById("swapQueen").style.backgroundImage = "url('img/QueenBlack.png')"
        document.getElementById("swapRook").style.backgroundImage = "url('img/RookBlack.png')"
        document.getElementById("swapHorse").style.backgroundImage = "url('img/HorseBlack.png')"
        document.getElementById("swapBishop").style.backgroundImage = "url('img/BishopBlack.png')"
    }else{
        document.getElementById("swapQueen").style.backgroundImage = "url('img/QueenWhite.png')"
        document.getElementById("swapRook").style.backgroundImage = "url('img/RookWhite.png')"
        document.getElementById("swapHorse").style.backgroundImage = "url('img/HorseWhite.png')"
        document.getElementById("swapBishop").style.backgroundImage = "url('img/BishopWhite.png')"
    }

    document.getElementById("swapQueen").addEventListener("click", function(){
        if(clr == "Black"){
            swepPieces(col, "QueenBlack")
            blackScore += 9;
            whiteScore -= 9;

        }else{
            swepPieces(col, "QueenWhite")
            blackScore -= 9;
            whiteScore += 9;
        }
        updateScore();  
        hideSwapMenu();
    })

    document.getElementById("swapRook").addEventListener("click", function(){
        if(clr == "Black"){
            swepPieces(col, "RookBlack")
            blackScore += 5;
            whiteScore -= 5;
        }else{
            swepPieces(col, "RookWhite")
            blackScore -= 5;
            whiteScore += 5;
        }
        updateScore();
        hideSwapMenu();
    })

    
    document.getElementById("swapHorse").addEventListener("click", function(){
        if(clr == "Black"){
            swepPieces(col, "HorseBlack")
            blackScore += 3;
            whiteScore -= 3;
        }else{
            swepPieces(col, "HorseWhite")
            blackScore -= 3;
            whiteScore += 3;
        }
        updateScore();
        hideSwapMenu();
    })

    document.getElementById("swapBishop").addEventListener("click", function(){
        if(clr == "Black"){
            swepPieces(col, "BishopBlack")
            blackScore += 3;
            whiteScore -= 3;
        }else{
            swepPieces(col, "BishopWhite")
            blackScore -= 3;
            whiteScore += 3;
        }
        updateScore();
        hideSwapMenu();
    })

}


function hideSwapMenu(){
    document.getElementById("swapOverlay").className = "";
    document.getElementById("swapOverlay").style.display = "none";
    document.getElementById("swapMenu").className = "";
}

function swepPieces(col, newPiece){

    let pos = String.fromCharCode(("h".charCodeAt(0) + 1) - (parseInt(col.substring(0, col.indexOf("/")- 1)))) + 1;

    for(let i = 0; i < pieces.length; i++){
        if(pieces[i][0] == pos){
            pieces[i][1] = newPiece;
            drawPieces();
        }
    }
}