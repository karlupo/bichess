class Pawn extends Piece{
    constructor(pos, color){
        if(pos.charAt(1) == "1"){
            super(pos, color, ["1Up", "2Up", "1Up/1Left", "1Up/1Right"], "Pawn");
        }else{
            super(pos, color, ["1Down", "2Down", "1Down/1Left", "1Down/1Right"], "Pawn");
        }
    }
}