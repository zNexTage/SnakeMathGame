const gameScenario = document.querySelector("[game-scenario]");

const squareStyle = {
    width: 100,
    height: 100,
    border: '1px solid'
};

const player = {
    ...squareStyle,
    backgroundColor: '#35DE3E',
    position: {
        row: 0,
        column: 0
    },
    points: 0,
    automaticMovimention: {
        direction: Directions.UP,
    }
}

const squareResults = {
    ...squareStyle,
    backgroundColor: '#82FA9E',
    positions: [],
    needUpdate: true,
    totalItens: 4
};

const scenarioLimits = {
    maxRow: 0,
    maxColumn: 0
};

const game = {
    isPlaying: true,
    centerRow: 0,
    centerColumn: 0
}
const getDivPoints = document.querySelector(divPoints.attrValue);

const adjustWidthSize = window.innerWidth - ((gameBorder + gameMargin) * 2) + 10;
const adjustHeightSize = window.innerHeight - (gameMargin + divPoints.margin + getDivPoints.offsetHeight);

const scenarioRows = Math.floor(adjustHeightSize / squareStyle.height);
const scenarioColumns = Math.floor(adjustWidthSize / squareStyle.width);

document.body.onload = function () {
    startGame();
}

document.onkeydown = function (event) {
    if (game.isPlaying) {
        player.automaticMovimention.direction = event.key;
    }
}

const startGame = () => {
    createScenario();
    engine();
}

const createScenario = () => {
    let centerRow, centerColumn;

    let rows = scenarioRows, columns = scenarioColumns;

    if (isEven(scenarioRows)) rows = scenarioRows - 1;

    if (isEven(scenarioColumns)) columns = scenarioColumns - 1;

    scenarioLimits.maxRow = rows;
    scenarioLimits.maxColumn = columns;

    centerRow = Math.floor(rows / 2) + 1;
    centerColumn = Math.floor(columns / 2) + 1;

    game.centerColumn = centerColumn;
    game.centerRow = centerRow;

    for (let row = 1; row <= rows; row++) {
        const newRow = document.createElement("tr");

        for (let column = 1; column <= columns; column++) {
            const newColumn = document.createElement("td");
            const newColumnStyle = newColumn.style;

            const position = document.createAttribute("position");
            position.value = `${row}-${column}`;

            newColumn.attributes.setNamedItem(position);

            if (row == centerRow && column == centerColumn) {
                newColumnStyle.backgroundColor = player.backgroundColor;

                player.position = {
                    row,
                    column
                };
            }

            newColumnStyle.width = `${squareStyle.width}px`;
            newColumnStyle.height = `${squareStyle.height}px`;
            newColumnStyle.border = squareStyle.border;

            newRow.appendChild(newColumn);
        }

        gameScenario.append(newRow);
    }
}

const playerMovement = (keyPress) => {
    let newRow = player.position.row, newColumn = player.position.column;

    let update = true;

    switch (keyPress) {
        case 'ArrowUp':
        case 'w': {
            player.automaticMovimention.direction = Directions.UP;
            if (player.position.row <= 1) {
                endGame();
                update = false;
            }
            else {
                newRow = player.position.row - 1;
            }

            break;
        }
        case 'ArrowDown':
        case 's': {
            player.automaticMovimention.direction = Directions.DOWN;
            if (player.position.row >= scenarioLimits.maxRow) {
                endGame();
                update = false;
            }
            else {
                newRow = player.position.row + 1;
            }

            break;
        }
        case 'ArrowLeft':
        case 'a': {
            player.automaticMovimention.direction = Directions.LEFT;
            if (player.position.column <= 1) {
                endGame();
                update = false;
            }
            else {
                newColumn = player.position.column - 1;
            }

            break;
        }
        case 'ArrowRight':
        case 'd': {
            player.automaticMovimention.direction = Directions.RIGHT;
            if (player.position.column >= scenarioLimits.maxColumn) {
                endGame();
                update = false;
            }
            else {
                newColumn = player.position.column + 1;
            }

            break;
        }
    }

    if (update) {
        if (squareResults.positions && squareResults.positions.length > 0) {
            const samePlayerPosition = squareResults.positions.some((position) => newRow == position.row && newColumn == position.column);

            if (samePlayerPosition) {
                new Sound("./sounds/coin-sound.mp3").play();
                squareResults.needUpdate = true;
                player.points = player.points + 10;
                document.querySelector("[points-label]").innerHTML = player.points;
            }
        }

        const playerActualPosition = getGameItemAttributeValue(player.position.row, player.position.column);

        const getItemOfPlayerPos = getGameItem(playerActualPosition);

        getItemOfPlayerPos.style.backgroundColor = 'white';

        const getPlayerNewPosition = `${newRow}-${newColumn}`;

        player.position = {
            column: newColumn,
            row: newRow
        };

        const newPlayerPosition = getGameItem(getPlayerNewPosition);

        newPlayerPosition.style.backgroundColor = player.backgroundColor;
    }
}

const engine = () => {
    setInterval(function () {
        if (game.isPlaying) {
            renderSquareResults();
            automaticPlayerMove();
        }
    }, frames);
}


const renderSquareResults = () => {
    if (squareResults.needUpdate) {
        const minRow = 1;
        const maxRow = scenarioRows;
        const minColumn = 1;
        const maxColumn = scenarioColumns;
        let samePlayerPosition = false, haveAnItemInThisPosition = false;
        let randomRow = 0, randomColumn = 0;

        clearAllSquareResults();



        squareResults.positions = new Array();

        for (let position = 0; position < squareResults.totalItens; position++) {
            do {
                randomRow = generateRandomNumber(minRow, maxRow);
                randomColumn = generateRandomNumber(minColumn, maxColumn);

                haveAnItemInThisPosition = false;

                haveAnItemInThisPosition = squareResults.positions.some((item) => item.row == randomRow && item.column == randomColumn);

                samePlayerPosition = randomRow == player.position.row && randomColumn == player.position.column;
            } while (samePlayerPosition || haveAnItemInThisPosition);

            const resultsSquareAttr = getGameItemAttributeValue(randomRow, randomColumn);

            const getSquareResultsNewPosition = getGameItem(`${resultsSquareAttr}`);

            squareResults.positions.push({
                column: randomColumn,
                row: randomRow
            });

            squareResults.needUpdate = false;

            getSquareResultsNewPosition.style.backgroundColor = squareResults.backgroundColor;
        }
    }
}


const clearAllSquareResults = () => {
    squareResults.positions.forEach((position) => {
        const resultsSquareAttr = getGameItemAttributeValue(position.row, position.column);

        const getSquareResultsNewPosition = getGameItem(`${resultsSquareAttr}`);

        getSquareResultsNewPosition.style.backgroundColor = "white";
    })
}

const getGameItem = (attrValue) => document.querySelector(`[position="${attrValue}"]`);

const getGameItemAttributeValue = (row, column) => `${row}-${column}`;

const automaticPlayerMove = () => {
    const automaticMovimention = player.automaticMovimention;

    playerMovement(automaticMovimention.direction);
}

const endGame = () => {
    game.isPlaying = false;

    //alert("Fim de jogo")
}
