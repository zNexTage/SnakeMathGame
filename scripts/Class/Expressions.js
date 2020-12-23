class Expressions {
    listExpressions = ['+', '*', '/', '-'];

    getRandomExpression = () => {
        const randomIndex = Math.floor(Math.random() * this.listExpressions.length);

        return this.listExpressions[randomIndex];
    }

    createExpression = (difficulty) => {
        let qtNumbersInExpression, maxNumber, qtItens;

        const possibilites = [];

        switch (difficulty) {
            case Difficulties.EASY: {
                qtNumbersInExpression = 2;
                qtItens = 4;
                maxNumber = 100;
                break;
            }
            case Difficulties.NORMAL: {
                qtNumbersInExpression = 3;
                qtItens = 8;
                maxNumber = 500;
                break;
            }
            case Difficulties.HARD: {
                qtNumbersInExpression = 4;
                qtItens = 12;
                maxNumber = 1000;
                break;
            }
        }

        let createdExpression = "";

        for (let i = 1; i <= qtNumbersInExpression; i++) {
            const number = generateRandomNumber(1, maxNumber);

            const expression = this.getRandomExpression();

            if (i < qtNumbersInExpression) {
                createdExpression += `${number}${expression}`;
            }
            else {
                createdExpression += `${number}`;
            }
        }

        const expressionResult = parseFloat(math.evaluate(createdExpression)).toFixed(2);

        possibilites.push({
            value: expressionResult,
            isCorrectAnswer: true
        });

        let qtToGenerate = qtItens - 1;

        for (let i = 0; i < qtToGenerate; i++) {
            let number;

            if (expressionResult < 0) {
                number = generateRandomNumber(-maxNumber, 0);
            }
            else {
                number = generateRandomNumber(0, maxNumber);
            }

            number = parseFloat(number).toFixed(2);

            possibilites.push({
                value: number,
                isCorrectAnswer: false
            });
        }

        possibilites.reverse();
        possibilites.sort();

        return {
            expression: createdExpression,
            possibilites,
            qtItens
        };
    }


}