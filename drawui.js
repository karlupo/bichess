const chessBoard = document.getElementById("chessboard");


//Wird gerade Weiß oder Schwarz gezeichnet
let white = true;


//Hier werden alle Figuren Divs gespeichert
let piecesDivs = new Array(32);


//Check ob die Figuren schon vorhanden sind
let firstTime = true;

let loaded = false;


//Ein Array mit allen Spielfiguren, deren Postitionen und Bildern
let pieces = [
    //Weiß
    [Pos = "h8", Img = "RookWhite"],
    [Pos = "g8", Img = "HorseWhite"],
    [Pos = "f8", Img = "BishopWhite"],
    [Pos = "d8", Img = "KingWhite"],
    [Pos = "e8", Img = "QueenWhite"],
    [Pos = "c8", Img = "BishopWhite"],
    [Pos = "b8", Img = "HorseWhite"],
    [Pos = "a8", Img = "RookWhite"],
    [Pos = "h7", Img = "PawnWhite"],
    [Pos = "g7", Img = "PawnWhite"],
    [Pos = "f7", Img = "PawnWhite"],
    [Pos = "e7", Img = "PawnWhite"],
    [Pos = "d7", Img = "PawnWhite"],
    [Pos = "c7", Img = "PawnWhite"],
    [Pos = "b7", Img = "PawnWhite"],
    [Pos = "a7", Img = "PawnWhite"],


    //Schwarz
    [Pos = "h1", Img = "RookBlack"],
    [Pos = "g1", Img = "HorseBlack"],
    [Pos = "f1", Img = "BishopBlack"],
    [Pos = "d1", Img = "KingBlack"],
    [Pos = "e1", Img = "QueenBlack"],
    [Pos = "c1", Img = "BishopBlack"],
    [Pos = "b1", Img = "HorseBlack"],
    [Pos = "a1", Img = "RookBlack"],
    [Pos = "h2", Img = "PawnBlack"],
    [Pos = "g2", Img = "PawnBlack"],
    [Pos = "f2", Img = "PawnBlack"],
    [Pos = "e2", Img = "PawnBlack"],
    [Pos = "d2", Img = "PawnBlack"],
    [Pos = "c2", Img = "PawnBlack"],
    [Pos = "b2", Img = "PawnBlack"],
    [Pos = "a2", Img = "PawnBlack"],

]

let overlayCounter = 0;
let overlay = new Array(32);

window.onload = function(){
    loaded = true;
}

//Zeichnet das Schachbrett
for(let i = 1; i <= 64; i++){
    let box = document.createElement("div");
    if(white){
        box.className = "whitebox";
    }else{
        box.className = "blackbox";
    }
    if(i % 8 == 0){
        white = !white;
    }
    white = !white;
    chessBoard.appendChild(box);
}





    //Erstmalig Zeichnen
    drawPieces();


/*
    Return: Void
    Beschreibung: Zeichnet die Spielfiguren und löscht die Alten
*/
function drawPieces(){


    for(let i = 0; i<pieces.length; i++){
        
        if(piecesDivs[i] == undefined && !firstTime) continue;


        //Entferne die Alte Figur wenn vorhanden
        if(!firstTime){
            document.getElementById("figures").removeChild(piecesDivs[i]);
        }

        //Neue Figur erstellen
        let figure = document.createElement("div");
        piecesDivs[i] = figure;
        piecesDivs[i].className = "figure";
        piecesDivs[i].style.gridRow = parseInt(pieces[i][0].charAt(1));
        piecesDivs[i].style.gridColumn = Math.abs(pieces[i][0].charCodeAt(0) - 105);
        piecesDivs[i].style.backgroundImage = `url('img/${pieces[i][1]}.png')`
    
        document.getElementById("figures").appendChild(piecesDivs[i]);
        

    }
    if(firstTime){
        firstTime = false;
    }

    if(loaded){
        handleClickFigures();
    }
}


function drawMoveOverlay(pos, piece, capture){


    if(capture){
        let circle = document.createElement("div");
        circle.className = "overlayTakeCirlce";
        circle.style.gridRow = parseInt(pos.charAt(1));
        circle.style.gridColumn = Math.abs(pos.charCodeAt(0) - 105);
        document.getElementById("overlay").appendChild(circle);
        overlay[overlayCounter++] = circle;
        return;
    }

    for(let i = 0; i < pieces.length; i++){
        //console.log(piece[1] + " / " + pos + "-" + pieces[i][0] + ": " + (pos == pieces[i][0]))
        if(pieces[i][0] == pos){
            if(!( (piece[1].indexOf("White") != -1 && pieces[i][1].indexOf("White") != -1) || (piece[1].indexOf("Black") != -1 && pieces[i][1].indexOf("Black") != -1)) && !piece[1].includes("Pawn")){
                let circle = document.createElement("div");
                circle.className = "overlayTakeCirlce";
                circle.style.gridRow = parseInt(pos.charAt(1));
                circle.style.gridColumn = Math.abs(pos.charCodeAt(0) - 105);
                document.getElementById("overlay").appendChild(circle);
                overlay[overlayCounter++] = circle;
            }
            return true;
        }
    }

    let circle = document.createElement("div");
    circle.className = "overlayCircle";
    circle.style.gridRow = parseInt(pos.charAt(1));
    circle.style.gridColumn = Math.abs(pos.charCodeAt(0) - 105);
    document.getElementById("overlay").appendChild(circle);
    overlay[overlayCounter++] = circle;
    return false;

}



