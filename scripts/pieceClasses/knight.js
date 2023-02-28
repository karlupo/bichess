class Knight extends Piece {
  constructor(pos, color) {
    super(
      pos,
      color,
      [
        "2Right/1Up",
        "1Right/2Up",
        "1Left/2Up",
        "2Left/1Up",
        "2Right/1Down",
        "1Right/2Down",
        "1Left/2Down",
        "2Left/1Down",
      ],
      "knight"
    );
  }
}
