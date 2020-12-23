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
        let expressionResult;

        do {
            expressionResult = "", createdExpression = "";

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

            expressionResult = math.evaluate(createdExpression);
        } while (!Number.isInteger(expressionResult));


        possibilites.push({
            value: expressionResult,
            isCorrectAnswer: true
        });

        let qtToGenerate = qtItens - 1;

        for (let i = 0; i < qtToGenerate; i++) {
            let randomExpression = generateRandomNumber(0, 49);

            let randomNumber = expressionResult * randomExpression;
            let number;

            if (randomNumber < 0) {
                number = generateRandomNumber(randomNumber, 0);
            }
            else {
                number = generateRandomNumber(0, randomNumber);
            }

            number = parseInt(number);

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