class Expressions {
    listExpressions = ['+', '*', '/', '^'];

    getRandomExpression = () => {
        const randomIndex = Math.floor(Math.random() * this.listExpressions.length);

        return this.listExpressions[randomIndex];
    }

    createExpression = (difficulty) => {
        let qtNumbersInExpression;

        switch (difficulty) {
            case Difficulties.EASY: {
                qtNumbersInExpression = 2;
                break;
            }
            case Difficulties.NORMAL: {
                qtNumbersInExpression = 3;
                break;
            }
            case Difficulties.HARD: {
                qtNumbersInExpression = 4;
                break;
            }
        }

        for (let i = 0; i < qtNumbersInExpression; i++) {

        }
    }
}