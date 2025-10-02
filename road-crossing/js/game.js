/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    init() {
        this.isTerminating = false;
        
        this.playerSpeed = 3;

        this.enemyMinY = 90;
        this.enemyMaxY = 280;

        this.enemyMinSpeed = 1;
        this.enemyMaxSpeed = 2;
    }

    preload() {
        this.load.image('background', 'assets/background.png');
        this.load.image('enemy', 'assets/dragon.png');
        this.load.image('player', 'assets/player.png');
        this.load.image('goal', 'assets/treasure.png');
    }

    create() {
        this.bg = this.add.sprite(0, 0, 'background');
        this.bg.setOrigin(0, 0);

        this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
        this.player.setScale(0.7, 0.7);

        this.goal = this.add.sprite(
            this.sys.game.config.width - 40,
            this.sys.game.config.height / 2,
            'goal'
        );

        this.enemies = this.add.group({
            key: 'enemy',
            repeat: 3,
            setXY: {
                x: 100,
                y: 100,
                stepX: 130,
                stepY: 20
            }
        });

        this.enemies.getChildren().forEach((enemy) => {
            enemy.setScale(0.8, 0.8);
            enemy.setFlipX(true);

            const direction = Phaser.Math.RND.pick([ -1, 1 ]);
            const speed = Phaser.Math.RND.realInRange(this.enemyMinSpeed, this.enemyMaxSpeed);
            enemy.setData('speed', direction * speed);
        });
    }

    update() {
        if (this.isTerminating) {
            return;
        }

        if (this.input.activePointer.isDown) {
            this.player.setX(this.player.x + this.playerSpeed);
        }

        const playerRect = this.player.getBounds();
        const goalRect = this.goal.getBounds();
        if (Phaser.Geom.Intersects.RectangleToRectangle(playerRect, goalRect)) {
            this.scene.restart();
            return;
        }

        this.enemies.getChildren().forEach(enemy => {
            enemy.setY(enemy.y + enemy.getData('speed'));

            if (enemy.y > this.enemyMaxY && enemy.getData('speed') > 0
                || enemy.y < this.enemyMinY && enemy.getData('speed') < 0) {
                enemy.setData('speed', -1 * enemy.getData('speed'));
            }

            const enemyRect = enemy.getBounds();

            if (Phaser.Geom.Intersects.RectangleToRectangle(enemyRect, playerRect)) {
                this.gameOver();
                return;
            }
        });
    }

    gameOver() {
        this.isTerminating = true;

        this.cameras.main.shake(500);

        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.SHAKE_COMPLETE, () => {
            this.cameras.main.fadeOut(500);
        });

        this.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
            this.scene.restart();
        });
    }
}

const gameScene = new GameScene('game');
const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene
});
