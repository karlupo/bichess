class Queen extends Piece{
    constructor(pos, color){
        super(pos, color, ["IUp", "ILeft", "IRight", "IDown", "ILeftDown", "ILeftUp", "IRightUp", "IRightDown"], "Queen");
    }
}