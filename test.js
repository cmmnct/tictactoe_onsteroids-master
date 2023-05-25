for (let i = 0; i < this.winRow; i++) {
    //h-
    if (x - i > -1 && y - i > -1) {
        if (this.boardArray[y][x - i] === this.gameData.currentPlayer.name) {
            testArray[0][center - i] = true;
        }
    }
    //h+
    if (x + i < this.boardArray[0].length) {
        if (this.boardArray[y][x + i] === this.gameData.currentPlayer.name) {
            testArray[0][center + i] = true;
        }
    }
    //v-
    if (y - i > -1) {
        if (this.boardArray[y - i][x] === this.gameData.currentPlayer.name) {
            testArray[1][center - i] = true;
        }
    }
    //v+
    if (y + i < this.boardArray.length) {
        if (this.boardArray[y + i][x] === this.gameData.currentPlayer.name) {
            testArray[1][center + i] = true;
        }
    }
    //diagonalAsc-
    if (y - i > -1 && x - i > -1) {
        if (this.boardArray[y - i][x - i] === this.gameData.currentPlayer.name) {
            testArray[2][center - i] = true;
        }
    }
    //diagonalAsc-
    if (y + i < this.boardArray.length && x - i > -1) {
        if (this.boardArray[y + i][x - i] === this.gameData.currentPlayer.name) {
            testArray[2][center + i] = true;
        }
    }
    //diagonalAsc-
    if (y - i > -1 && x + i < this.boardArray[0].length) {
        if (this.boardArray[y - i][x + i] === this.gameData.currentPlayer.name) {
            testArray[3][center - i] = true;
        }
    }
    //diagonalAsc-
    if (y + i < this.boardArray.length && x + i < this.boardArray[0].length) {
        if (this.boardArray[y + i][x + i] === this.gameData.currentPlayer.name) {
            testArray[3][center + i] = true;
        }
    }



}