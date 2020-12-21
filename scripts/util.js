const isEven = (number) => number % 2 == 0;

const gameBorder = 15;
const gameMargin = 15;

const frames = 500;

const divPoints = {
    attrValue: "[div-points]",
    margin: 10
}

const generateRandomNumber = (min, max) => {
    let number = Math.random() * (max - min) + min;

    number = Math.floor(number);

    return number;
}