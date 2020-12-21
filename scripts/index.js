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
        enabled: true,
        playerMovementInterval: ""
    }

}

const coin = {
    ...squareStyle,
    backgroundColor: '#82FA9E',
    position: {
        row: 0,
        column: 0
    },
    needUpdate: true
};

const scenarioLimits = {
    maxRow: 0,
    maxColumn: 0
};


const getDivPoints = document.querySelector(divPoints.attrValue);

const adjustWidthSize = window.innerWidth - ((gameBorder + gameMargin) * 2) + 10;
const adjustHeightSize = window.innerHeight - (gameMargin + divPoints.margin + getDivPoints.offsetHeight);

const scenarioRows = Math.floor(adjustHeightSize / squareStyle.height);
const scenarioColumns = Math.floor(adjustWidthSize / squareStyle.width);
console.log(adjustHeightSize / squareStyle.height);

document.body.onload = function () {
    startGame();
}

document.onkeydown = function (event) {
    player.automaticMovimention.enabled = false;
    playerMovementInterval()
    playerMovement(event.key)
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
                update = false;
            }
            else {
                newColumn = player.position.column + 1;
            }

            break;
        }
    }

    if (update) {
        const playerActualPosition = getGameItemAttributeValue(player.position.row, player.position.column);

        if (newRow == coin.position.row && newColumn == coin.position.column) {
            new Sound("./sounds/coin-sound.mp3").play();
            coin.needUpdate = true;
            player.points = player.points + 10;
            document.querySelector("[points-label]").innerHTML = player.points;
        }

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
        renderCoin();
        automaticPlayerMove();
    }, frames);
}

const playerMovementInterval = function () {
    player.automaticMovimention.playerMovementInterval = setInterval(function () {
        player.automaticMovimention.enabled = true;
    }, frames * 2);

    player.automaticMovimention.playerMovementInterval;
}

const renderCoin = () => {
    if (coin.needUpdate) {
        const minRow = 1;
        const maxRow = scenarioRows;
        const minColumn = 1;
        const maxColumn = scenarioColumns;
        let samePlayerPosition = false;
        let randomRow = 0, randomColumn = 0;

        do {
            randomRow = generateRandomNumber(minRow, maxRow);
            randomColumn = generateRandomNumber(minColumn, maxColumn);

            if (randomRow == player.position.row && randomColumn == player.position.column) {
                samePlayerPosition = true;
            }
            else {
                samePlayerPosition = false;
            }
        } while (samePlayerPosition);

        const coinAttr = getGameItemAttributeValue(randomRow, randomColumn);

        const getCoinNewPosition = getGameItem(`${coinAttr}`);

        coin.position = {
            column: randomColumn,
            row: randomRow
        }

        coin.needUpdate = false;

        getCoinNewPosition.style.backgroundColor = coin.backgroundColor;
    }
}

const getGameItem = (attrValue) => document.querySelector(`[position="${attrValue}"]`);

const getGameItemAttributeValue = (row, column) => `${row}-${column}`;

const automaticPlayerMove = () => {
    const automaticMovimention = player.automaticMovimention;

    if (automaticMovimention.enabled) {
        playerMovement(automaticMovimention.direction);
    }
}
