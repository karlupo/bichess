class Pawn extends Piece{
    constructor(pos, color){
        if(pos.charAt(1) == "1"){
            super(pos, color, ["1U", "2U", "1U/1L", "1U/1R"], "Pawn");
        }else{
            super(pos, color, ["1D", "2D", "1D/1L", "1D/1R"], "Pawn");
        }
    }
}                                                               