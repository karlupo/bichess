class Piece{

    //Pos: AnchorPoint: Link Unten; Erste Zahl: Column, Zweite Zahl: Row;
    pos;

    //Black or White
    color;

    //z.B. [1Up, 1Left, 1Right/2Left, IRightDown] --> Kann entweder eins Hoch, eins Left oder 1Hoch und 2Left gehen oder Unendlich nach Rechts Unten
    moves;

    //z.B. Pawn, Rook, Queen
    name;

    constructor(pos, color, moves, name){
        this.pos = pos;
        this.color = color;
        this.moves = moves;
        this.name = name;
    }
}

