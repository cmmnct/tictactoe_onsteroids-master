export class Player {
    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}
export default class GameController extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
        <link rel="stylesheet" href="style.css">
             <div id="controller-menu">
        Width: <input type="range" min="3" max="12" value="3" id="input-width"> 
        Height: <input type="range" min="3" max="12" value="3"  id="input-height">  
        <span id="winrow-container">Win row: <input type="range" min="3" max="3"  value="3" disabled id="input-winrow"><output id="output-winrow">3</output></span>
    </div>
                <div id="game">
                    <div id="field"></div>
                    <div id="score">
                        <div>
                            <div><img src="/images/playerX.svg" style="width: 24px"></div>
                            <input type="text" disabled id="score-kruisje">
                        </div>
                        <div>
                            <div><img src="/images/playerO.svg" style="width: 24px"></div>
                            <input type="text" disabled id="score-rondje">
                        </div>
                    </div>
                    <button id="btn-start">Play again</button>
                </div>
    `;
        this.controllerMenu = this.shadowRoot.getElementById('controller-menu')
        this.field = this.shadowRoot.getElementById('field');
        this.score = this.shadowRoot.getElementById('score');
        this.btnStart = this.shadowRoot.getElementById('btn-start');
        this.scoreKruisje = this.shadowRoot.getElementById('score-kruisje');
        this.scoreRondje = this.shadowRoot.getElementById('score-rondje');
        this.outputWinRow = this.shadowRoot.getElementById('output-winrow');
        this.inputWinRow = this.shadowRoot.getElementById('input-winrow');
        this.winrowContainer = this.shadowRoot.getElementById('winrow-container');
        this.init();
    }


    fieldDimensions = {
        width: 3,
        height: 3
    }
    winRow = 3;
    maxRow = 3;
    boardArray = [];
    step = 0;
    playerX = new Player('x', 0);
    playerO = new Player('o', 0);
    currentPlayer = '';
    domElements = document.createElement('div');
    readyForInit = false;

    init() {
        this.controllerMenu.addEventListener('input', this.updateSettings.bind(this));
        this.domElements.addEventListener('click', this.onMove.bind(this));
        this.btnStart.addEventListener('click', this.clearAll.bind(this));

        this.boardArray = this.createBoard(this.fieldDimensions.width, this.fieldDimensions.height); // maak een data array met het gekoen aantal vlakken
        console.log(this.boardArray)
        if (this.currentPlayer) { // als het spel al gespeeld is...
            this.togglePlayer(); // switch de player
        } else { // of...
            this.setCurrentPlayer(Math.random() > 0.5 ? this.playerX : this.playerO); // kies random een speler
        }
        this.domElements.innerHTML = ''; // maak het veld leeg
        this.field.appendChild(this.getDomElements()); // vul het veld opnieuw met lege vlakken
    }
    clearAll() {
        this.btnStart.style.visibility = 'hidden';
        this.step = 0;
        this.domElements.innerHTML = '';
        this.readyForInit = false;
        this.boardArray = this.createBoard(this.fieldDimensions.width, this.fieldDimensions.height);
        console.log(this.boardArray)
        this.domElements.innerHTML = '';
        this.field.appendChild(this.getDomElements());
    }
    updateSettings(event) {
        console.log(event.target.value);
        switch (event.target.id) {
            case 'input-width': this.fieldDimensions.width = Number(event.target.value);
                this.checkValidityWinRow();
                break;
            case 'input-height': this.fieldDimensions.height = Number(event.target.value);
                this.checkValidityWinRow();
                break;
            case 'input-winrow': this.winRow = Number(event.target.value);
                this.outputWinRow.value = Number(event.target.value);
                break;

        };
        this.clearAll();
    }

    checkValidityWinRow() {
        this.winRow = Math.min(this.fieldDimensions.height, this.fieldDimensions.width, this.winRow);
        let maxRow = Math.min(this.fieldDimensions.height, this.fieldDimensions.width, 6);

        this.outputWinRow.value = this.winRow;
        this.inputWinRow.value = this.winRow;
        this.inputWinRow.max = maxRow;
        maxRow > 3 ? this.inputWinRow.disabled = false : this.inputWinRow.disabled = true;
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
                let newColElement = document.createElement('div');
                newColElement.className = this.boardArray[iy][ix];
                newColElement.dataset.x = ix;
                newColElement.dataset.y = iy;
                newRowElement.appendChild(newColElement)
            })
        })
        return this.domElements;
    }

    togglePlayer() {
        switch (this.currentPlayer) {
            case this.playerX:
                this.setCurrentPlayer(this.playerO);
                break;
            case this.playerO:
                this.setCurrentPlayer(this.playerX);
                break;
        }
    }
    setCurrentPlayer(player) {
        this.domElements.className = player.name;
        this.currentPlayer = player;
    }

    onMove(event) {
        if (event.target.className === 'e' && !this.readyForInit) {
            this.step++;
            let thisX = Number(event.target.dataset.x);
            let thisY = Number(event.target.dataset.y);
            console.log('thisX ', thisX, "thisY ", thisY);
            this.boardArray[thisY][thisX] = this.currentPlayer.name;
            event.target.className = this.currentPlayer.name;
            console.log('boardArray', this.boardArray);
            if (this.evaluateMove(thisX, thisY)) {
                this.endAndReset()
            }
            else if (this.step === (this.fieldDimensions.width * this.fieldDimensions.height)) {
                this.btnStart.style.visibility = 'visible';
            }
            else this.togglePlayer();
        }
    }

    evaluateMove(x, y) {
        let win = false;
        console.log(this.currentPlayer.name)
        let center = this.winRow - 1;
        let testArray = Array.apply(null, Array(4)).map(row =>
            Array.apply(null, Array((this.winRow * 2) - 1)).map(item => false)
        );
        console.log(testArray)
        testArray.forEach(element => element[center] = true);
        for (let i = 0; i < this.winRow; i++) {
            //h-
            if (x - i > -1 && y - i > -1) {
                console.log('check h- ', this.boardArray[y][x - i])
                if (this.boardArray[y][x - i] === this.currentPlayer.name) {
                    testArray[0][center - i] = true;
                }
            }
            //h+
            if (x + i < this.boardArray[0].length) {
                if (this.boardArray[y][x + i] === this.currentPlayer.name) {
                    testArray[0][center + i] = true;

                }
            }
            //v-
            if (y - i > -1) {
                if (this.boardArray[y - i][x] === this.currentPlayer.name) {
                    testArray[1][center - i] = true;
                }
            }
            //v+
            if (y + i < this.boardArray.length) {
                if (this.boardArray[y + i][x] === this.currentPlayer.name) {
                    testArray[1][center + i] = true;
                }
            }

            //dia1
            if (y - i > -1 && x - i > -1) {
                if (this.boardArray[y - i][x - i] === this.currentPlayer.name) {
                    testArray[2][center - i] = true;
                }
            }
            //dia2
            if (y + i < this.boardArray.length && x - i > -1) {
                if (this.boardArray[y + i][x - i] === this.currentPlayer.name) {
                    testArray[2][center + i] = true;
                }
            }
            //dia3
            if (y - i > -1 && x + i < this.boardArray[0].length) {
                if (this.boardArray[y - i][x + i] === this.currentPlayer.name) {
                    testArray[3][center - i] = true;
                }
            }
            //dia4
            if (y + i < this.boardArray.length && x + i < this.boardArray[0].length) {
                if (this.boardArray[y + i][x + i] === this.currentPlayer.name) {
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
                        //  this.highlightWinningRow(combination);
                    }
                }
            )
        })
        return win;

    }
    endAndReset() {
        this.readyForInit = true;
        this.currentPlayer.score++;
        this.scoreKruisje.value = this.playerX.score;
        this.scoreRondje.value = this.playerO.score;
        console.log(this.field);
        this.btnStart.style.visibility = 'visible';
    }
    highlightWinningRow(combination) {
        const nodes = Array.prototype.slice.call(this.field.children); // goed Googlen!!!
        combination.forEach(pos => nodes[pos - 1].classList.add('win')); // maak de winnende combinatie groen
    }
}

customElements.define('tic-tac-toe', GameController);