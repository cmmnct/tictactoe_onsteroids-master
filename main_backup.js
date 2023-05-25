
export class FieldData {
    constructor(width,height, winRow) {
        this.winRow = winRow;
        //start a the first side and add n arrays of n
        this.combination = [];
        this.testArray = this.createBoard(width, height);
        console.log(this.testArray)
        this.boardArray = [
            ['x', 'o', 'x', 'o', 'x', 'o', 'x'],
            ['o', 'x', 'o', 'x', 'o', 'x', 'o'],
            ['x', 'o', 'x', 'o', 'x', 'o', 'x'],
            ['o', 'x', 'o', 'x', 'x', 'x', 'o'],
            ['x', 'o', 'x', 'o', 'x', 'o', 'o'],
            ['o', 'x', 'o', 'x', 'o', 'x', 'o']

        ]
    }
    createBoard(x, y) {
        let arr = Array.apply(null, Array(y)).map(row =>
            Array.apply('', Array(x)).map(item => '')
        );
        return arr;
    }
    evaluateMove(x, y, symbol, boardArray) {
        let center = this.winRow - 1;
        let testArray = Array.apply(null, Array(4)).map(row =>
            Array.apply(null, Array((this.winRow * 2) - 1)).map(item => false)
        );
        testArray[center][center] = true;
        testArray.forEach(element => element[center] = true);
        console.log(boardArray[0].length);
        for (let i = 0; i < this.winRow; i++) {
            //h-
            if (x - i > -1 && y - i > -1) {
                if (boardArray[y][x - i] === symbol) {
                    testArray[0][center - i] = true;
                }
            }
            //h+
            if (x + i < boardArray[0].length) {
                if (boardArray[y][x + i] === symbol) {
                    testArray[0][center + i] = true;
                }
            }
            //v-
            if (y - i > -1) {
                if (boardArray[y - i][x] === symbol) {
                    testArray[1][center - i] = true;
                }
            }
            //v+
            if (y + i < boardArray.length) {
                if (boardArray[y + i][x] === symbol) {
                    testArray[1][center + i] = true;
                }
            }
            //diagonalAsc-
            if (y - i > -1 && x - i > -1) {
                if (boardArray[y - i][x - i] === symbol) {
                    testArray[2][center - i] = true;
                }
            }
            //diagonalAsc-
            if (y + i < boardArray.length && x - i > -1) {
                if (boardArray[y + i][x - i] === symbol) {
                    testArray[2][center + i] = true;
                }
            }
            //diagonalAsc-
            if (y - i > -1 && x + i < boardArray[0].length) {
                if (boardArray[y - i][x + i] === symbol) {
                    testArray[3][center - i] = true;
                }
            }
            //diagonalAsc-
            if (y + i < boardArray.length && x + i < boardArray[0].length) {
                if (boardArray[y + i][x + i] === symbol) {
                    testArray[3][center + i] = true;
                }
            }
        }
        let win=false;
        testArray.map(row => {
            let check = [];
            row.map(
                (pos, index) => {
                    if (pos) {
                        check.push(true);
                    } else if (check.length < this.winRow) {
                        check = [];
                    }
                    if (check.length === this.winRow) {
                        win = true;
                    }
                }
            )
        })
        console.log(testArray)
        return win;
    }
}
const fieldData = new FieldData(7,6, 3);
console.log(fieldData.evaluateMove(0,0, 'o', fieldData.boardArray));