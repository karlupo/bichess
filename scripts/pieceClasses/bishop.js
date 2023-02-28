class Bishop extends Piece {
    constructor(pos, color) {
        super(pos, color, ["ILeftUp", "ILeftDown", "IRightUp", "IRightDown"], "Bishop");
    }
}