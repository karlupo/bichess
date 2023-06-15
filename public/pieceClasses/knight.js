class Knight extends Piece {
  constructor(pos, color) {
    super(
      pos,
      color,
      [
        "2R/1U",
        "1R/2U",
        "1L/2U",
        "2L/1U",
        "2R/1D",
        "1R/2D",
        "1L/2D",
        "2L/1D",
      ],
      "Knight"
    );
  }
}