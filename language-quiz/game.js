class Game {
    questions = [];
    currentIndex = 0;
    score = 0;

    constructor(questions) {
        this.questions = questions;
    }

    start() {
        const altDivs = document.querySelectorAll('.alternative');
        altDivs.forEach((altDiv, i) => {
            altDiv.addEventListener('click', () => {
                this.checkAnswer(this.currentQuestion().alternatives[i]);
                this.stepQuestion();
                this.showQuestion();
            });
        });

        this.showQuestion();
        this.displayScore();
    }

    showQuestion() {
        const question = this.currentQuestion();

        const titleDiv = document.querySelector('#title');
        titleDiv.textContent = question.title;

        const altDivs = document.querySelectorAll('.alternative');
        altDivs.forEach((altDiv, i) => {
            altDiv.textContent = question.alternatives[i];
        });
    }

    currentQuestion() {
        return this.questions[this.currentIndex];
    }

    checkAnswer(userResponse) {
        const resultDiv = document.querySelector('#result');

        if (this.currentQuestion().correctAnswer == userResponse) {
            resultDiv.textContent = 'Correct answer!';
            this.score++;
            this.displayScore();
        } else {
            resultDiv.textContent = 'Wrong answer. Correct was: ' + this.currentQuestion().correctAnswer;
        }
    }

    stepQuestion() {
        this.currentIndex++;
        if (this.currentIndex >= this.questions.length) {
            this.currentIndex = 0;
        }
    }

    displayScore() {
        const scoreDiv = document.querySelector('#score');
        scoreDiv.textContent = 'Score: ' + this.score;
    }
}

const questions = [
    {
        title: 'macska',
        alternatives: [ 'dog', 'cat', 'window', 'tree' ],
        correctAnswer: 'cat'
    },
    {
        title: 'ablak',
        alternatives: ['window', 'door', 'keyboard', 'wall'],
        correctAnswer: 'window'
    },
    {
        title: 'számítógép',
        alternatives: [ 'knife', 'mobile', 'computer', 'mouse' ],
        correctAnswer: 'computer'
    }
];
const game = new Game(questions);
game.start();