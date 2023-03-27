class Bishop extends Piece {
    constructor(pos, color) {
        super(pos, color, ["IL/IU", "IL/ID", "IR/IU", "IR/ID"], "Bishop");
    }
}