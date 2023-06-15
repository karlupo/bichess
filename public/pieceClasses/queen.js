class Queen extends Piece{
    constructor(pos, color){
        super(pos, color, ["IU", "IL", "IR", "ID", "IL/ID", "IL/IU", "IR/IU", "IR/ID"], "Queen");
    }
}