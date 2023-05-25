export class Player {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}
export class FieldData {
    constructor(fieldWidth, fieldHeight, winRow) {
        this.winRow = winRow;
        this.boardArray = this.createBoard(fieldWidth, fieldHeight);
        this.gameData = {
            numberOfFields: 9,
            step: 0,
            playerX: new Player('x', 0),
            playerO: new Player('o', 0),
            currentPlayer: ''
        };
        this.domElements = document.createElement('div');
        this.readyForInit = false;
        this.init();
    };

    init() {
        if (this.gameData.currentPlayer) { // als het spel al gespeeld is...
            this.togglePlayer(); // switch de player
        } else { // of...
            this.setCurrentPlayer(Math.random() > 0.5 ? this.gameData.playerX : this.gameData.playerO); // kies random een speler
        }
        this.domElements.addEventListener('click', this.onMove.bind(this));

    }
    createBoard(width, height) {
        let arr = Array.apply(null, Array(height)).map(row =>
            Array.apply('', Array(width)).map(item => 'e')
        );
        return arr;
    };
    getDomElements() {
        this.boardArray.forEach((row, iy) => {
            let newRowElement = document.createElement('div');
            this.domElements.appendChild(newRowElement);
            row.forEach((pos, ix) => {
                let newPosElement = document.createElement('div');
                newPosElement.className = this.boardArray[iy][ix]
                newPosElement.dataset.x = ix;
                newPosElement.dataset.y = iy;
                newRowElement.appendChild(newPosElement)
            })
        })
        return this.domElements;
    }

    togglePlayer() {
        switch (this.gameData.currentPlayer) {
            case this.gameData.playerX:
                this.setCurrentPlayer(this.gameData.playerO);
                break;
            case this.gameData.playerO:
                this.setCurrentPlayer(this.gameData.playerX);
                break;
        }
    }
    setCurrentPlayer(player) {
        this.domElements.className = player.name;
        this.gameData.currentPlayer = player;
    }

    onMove(event) {
        if (!this.readyForInit) {
            let thisX = Number(event.target.dataset.x);
            let thisY = Number(event.target.dataset.y);
            console.log('thisX ', thisX, "thisY ", thisY);
            this.boardArray[thisY][thisX] = this.gameData.currentPlayer.name;
            event.target.className = this.gameData.currentPlayer.name;
            console.log('boardArray', this.boardArray);
            if (this.evaluateMove(thisX, thisY)) {
                this.readyForInit = true;
            } else this.togglePlayer();
        }

    }

    evaluateMove(x, y) {
        let win = false;
        console.log(this.gameData.currentPlayer.name)
        let center = this.winRow - 1;
        let testArray = Array.apply(null, Array(4)).map(row =>
            Array.apply(null, Array((this.winRow * 2) - 1)).map(item => false)
        );
        testArray[center][center] = true;
        testArray.forEach(element => element[center] = true);
        for (let i = 0; i < this.winRow; i++) {
            //h-
            if (x - i > -1 && y - i > -1) {
                console.log('check h- ', this.boardArray[y][x - i])
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
            //dia1
            if (y - i > -1 && x - i > -1) {
                if (this.boardArray[y - i][x - i] === this.gameData.currentPlayer.name) {
                    testArray[2][center - i] = true;
                }
            }
            //dia2
            if (y + i < this.boardArray.length && x - i > -1) {
                if (this.boardArray[y + i][x - i] === this.gameData.currentPlayer.name) {
                    testArray[2][center + i] = true;
                }
            }
            //dia3
            if (y - i > -1 && x + i < this.boardArray[0].length) {
                if (this.boardArray[y - i][x + i] === this.gameData.currentPlayer.name) {
                    testArray[3][center - i] = true;
                }
            }
            //dia4
            if (y + i < this.boardArray.length && x + i < this.boardArray[0].length) {
                if (this.boardArray[y + i][x + i] === this.gameData.currentPlayer.name) {
                    testArray[3][center + i] = true;
                }
            }
        }
        console.log(testArray)
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
        if (win) {
            console.log('gewonnen!')
        }
        return win;

    }
}
const fieldData = new FieldData(9, 9, 4);
document.getElementById('game').appendChild(fieldData.getDomElements());