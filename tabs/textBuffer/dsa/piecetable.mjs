class Piece {
    constructor(text, length) {
        this.text = text;
        this.length = length;
    }
}

class PieceTable {
    constructor(original) {
        this.original = original;
        this.add = new Piece('', 0);
        this.pieces = [this.original];
    }

    insert(index, text) {
        const [left,right] = this.splitPieces(index);

        const newPiece = new Piece(text, text.length);
        this.pieces.splice(index + 1, 0, newPiece);

        this.joinPieces(left, newPiece, right);
    }

    splitPieces(index) {
        const left = this.pieces[index];
        const right = new Piece(
            left.text.substring(index - this.getPieceOffset(index)),
            left.length - index + this.getPieceOffset(index)
        );

        left.text = left.t
    }

    joinPieces(left, newPiece, right) {

    }
}