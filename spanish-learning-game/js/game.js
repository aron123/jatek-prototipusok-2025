/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    init() {
        this.answers = {
            'building': 'edificio',
            'car': 'automóvil',
            'house': 'casa',
            'tree': 'árbol'
        };
    }

    preload() {
        this.load.image('background', 'assets/img/background-city.png');
        this.load.image('building', 'assets/img/building.png');
        this.load.image('car', 'assets/img/car.png');
        this.load.image('house', 'assets/img/house.png');
        this.load.image('tree', 'assets/img/tree.png');

        this.load.audio('correctAudio', 'assets/audio/correct.mp3');
        this.load.audio('wrongAudio', 'assets/audio/wrong.mp3');

        this.load.audio('treeAudio', 'assets/audio/arbol.mp3');
        this.load.audio('carAudio', 'assets/audio/auto.mp3');
        this.load.audio('houseAudio', 'assets/audio/casa.mp3');
        this.load.audio('buildingAudio', 'assets/audio/edificio.mp3');
    }

    create() {
        this.bg = this.add.sprite(0, 0, 'background');
        this.bg.setOrigin(0, 0);

        this.items = this.add.group([
            {
                key: 'building',
                setXY: {
                    x: 90,
                    y: 220
                }
            },
            {
                key: 'car',
                setXY: {
                    x: 250,
                    y: 275
                },
                setScale: {
                    x: 0.8,
                    y: 0.8
                }
            },
            {
                key: 'house',
                setXY: {
                    x: 430,
                    y: 250
                }
            },
            {
                key: 'tree',
                setXY: {
                    x: 575,
                    y: 230
                }
            },
        ]);

        this.correctAudio = this.sound.add('correctAudio');
        this.wrongAudio = this.sound.add('wrongAudio');

        this.items.getChildren().forEach(item => {
            item.setInteractive();

            item.setData('spanish', this.answers[item.texture.key]);
            item.setData('audio', this.sound.add(item.texture.key + 'Audio'));

            const alphaTween = this.tweens.add({
                targets: item,
                alpha: 0.7,
                duration: 300,
                paused: true,
                persist: true
            });

            const correctTween = this.tweens.add({
                targets: item,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 300,
                paused: true,
                persist: true,
                yoyo: true,
                ease: Phaser.Math.Easing.Quadratic.InOut
            });

            const wrongTween = this.tweens.add({
                targets: item,
                scaleX: 1.2,
                scaleY: 1.2,
                angle: 90,
                duration: 300,
                paused: true,
                persist: true,
                yoyo: true,
                ease: Phaser.Math.Easing.Quadratic.InOut
            });

            item.on(Phaser.Input.Events.POINTER_OVER, () => {
                alphaTween.play();
            });

            item.on(Phaser.Input.Events.POINTER_OUT, () => {
                alphaTween.pause();
                item.setAlpha(1);
            });

            item.on(Phaser.Input.Events.POINTER_DOWN, () => {
                if (item.getData('spanish') == this.wordText.text) {
                    correctTween.play();
                    this.correctAudio.play();
                    this.showQuestion();
                } else {
                    wrongTween.play();
                    this.wrongAudio.play();
                }
            });
        });

        this.wordText = this.add.text(20, 20, '', {
            font: '30px Arial',
            fill: 'yellow'
        });

        this.showQuestion();
    }

    showQuestion() {
        this.currentQuestion = Phaser.Math.RND.pick(this.items.getChildren());

        // show text
        this.wordText.setText(this.currentQuestion.getData('spanish'));

        // play audio
        this.currentQuestion.getData('audio').play();
    }
}

const gameScene = new GameScene('game');
const game = new Phaser.Game({
    width: 640,
    height: 360,
    scene: gameScene
});