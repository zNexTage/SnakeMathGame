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
        direction: Directions.RIGHT,
    }
}

const squareResults = {
    ...squareStyle,
    backgroundColor: '#82FA9E',
    positions: [],
    needUpdate: false,
};

const scenarioLimits = {
    maxRow: 0,
    maxColumn: 0
};

const game = {
    isPlaying: false,
    centerRow: 0,
    centerColumn: 0
}

const getDivPoints = document.querySelector(divPoints.attrValue);

const adjustWidthSize = window.innerWidth - ((gameBorder + gameMargin) * 2) + 10;
const adjustHeightSize = window.innerHeight - (gameMargin + getDivPoints.offsetHeight);

const scenarioRows = Math.floor(adjustHeightSize / squareStyle.height);
const scenarioColumns = Math.floor(adjustWidthSize / squareStyle.width);

document.body.onload = function () {
    createScenario();    
    engine();
}

document.onkeydown = function (event) {
    if (game.isPlaying) {
        player.automaticMovimention.direction = event.key;
    }
}

const startGame = () => {
    game.isPlaying = true;
    player.automaticMovimention.direction = Directions.RIGHT;
    squareResults.needUpdate = true;
    dismissModal();
}

const endGame = () => {
    game.isPlaying = false;
    const playerPosition = getGameItemAttributeValue(player.position.row, player.position.column);

    const playerDiv = getGameItem(playerPosition);

    playerDiv.style.backgroundColor = player.backgroundColor;

    clearAllSquareResults();

    const getPlayerPositionAttr = getGameItemAttributeValue(player.position.row, player.position.column);

    const getPlayerPosition = getGameItem(getPlayerPositionAttr);

    getPlayerPosition.style.backgroundColor = 'white';

    player.position = {
        row: game.centerRow,
        column: game.centerColumn
    };

    player.points = 0;

    document.querySelector("[points-label]").innerHTML = player.points;

    showModal();
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

            newColumnStyle.maxWidth = `${squareStyle.width}px`;
            newColumnStyle.maxHeight = `${squareStyle.height}px`;
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
            const playerPosition = squareResults.positions.find((position) => newRow == position.row && newColumn == position.column);

            if (playerPosition) {
                let playerResults = {};

                if (playerPosition.containCorrectAnswer) {
                    playerResults = {
                        sound: "./Sounds/coin-sound.mp3",
                        points: player.points + 10
                    }
                }
                else {
                    playerResults = {
                        sound: "./Sounds/wrong_answer.mp3",
                        points: player.points - 5
                    }
                }

                player.points = playerResults.points;
                squareResults.needUpdate = true;
                new Sound(playerResults.sound).play();
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
        let haveAnItemInThisPosition = false, isCloseToThePlayer = false;
        let randomRow = 0, randomColumn = 0;

        clearAllSquareResults();

        squareResults.positions = new Array();

        const { expression, qtItens, possibilites } = new Expressions().createExpression(Difficulties.EASY);

        const expressionToResolve = document.querySelector("[expression-to-resolve]");

        expressionToResolve.innerHTML = `${expression} = ?`;

        const positionsClose = positionsCloseToThePlayer();

        for (let position = 0; position < qtItens; position++) {
            do {
                randomRow = generateRandomNumber(minRow, maxRow);
                randomColumn = generateRandomNumber(minColumn, maxColumn);

                haveAnItemInThisPosition = false;

                haveAnItemInThisPosition = squareResults.positions.some((item) => item.row == randomRow && item.column == randomColumn);

                const attrPosition = getGameItemAttributeValue(randomRow, randomColumn);

                isCloseToThePlayer = positionsClose.includes(attrPosition);
            } while (haveAnItemInThisPosition || isCloseToThePlayer);

            const resultsSquareAttr = getGameItemAttributeValue(randomRow, randomColumn);

            const getSquareResultsNewPosition = getGameItem(`${resultsSquareAttr}`);

            squareResults.positions.push({
                column: randomColumn,
                row: randomRow,
                containCorrectAnswer: possibilites[position].isCorrectAnswer
            });

            squareResults.needUpdate = false;

            getSquareResultsNewPosition.style.backgroundColor = squareResults.backgroundColor;
            getSquareResultsNewPosition.style.border = squareStyle.border;;
            getSquareResultsNewPosition.innerHTML = `<label style="color:green;">${possibilites[position].value}</label>`
        }
    }
}


const clearAllSquareResults = () => {
    squareResults.positions.forEach((position) => {
        const resultsSquareAttr = getGameItemAttributeValue(position.row, position.column);

        const getSquareResultsNewPosition = getGameItem(resultsSquareAttr);

        getSquareResultsNewPosition.style.backgroundColor = "white";
        getSquareResultsNewPosition.innerHTML = "";
    })
}

const getGameItem = (attrValue) => document.querySelector(`[position="${attrValue}"]`);

const getGameItemAttributeValue = (row, column) => `${row}-${column}`;

const automaticPlayerMove = () => {
    const automaticMovimention = player.automaticMovimention;

    playerMovement(automaticMovimention.direction);
}

const positionsCloseToThePlayer = () => {
    const playerRow = player.position.row, playerColumn = player.position.column;
    const positionsClose = [];

    let startRow, startColumn, endRow, endColumn;

    startRow = playerRow - 2;

    if (startRow <= 0) {
        startRow = 1;
    }

    endRow = playerRow + 2;

    if (endRow >= scenarioLimits.maxRow) {
        endRow = scenarioLimits.maxRow;
    }

    startColumn = playerColumn - 2;

    if (startColumn <= 0) {
        startColumn = 1;
    }

    endColumn = playerColumn + 2;

    if (endColumn >= scenarioLimits.maxColumn) {
        endColumn = scenarioLimits.maxColumn;
    }

    for (let row = startRow; row <= endRow; row++) {
        for (let column = startColumn; column <= endColumn; column++) {
            const closePosition = getGameItemAttributeValue(row, column);
            positionsClose.push(closePosition);
        }
    }

    return positionsClose;
}