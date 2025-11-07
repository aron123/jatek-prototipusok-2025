/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    init() {
        this.stats = { health: 100, fun: 100 };
        this.statsDecay = { health: -10, fun: -10 };
        this.selectedItem = null;
        this.uiBlocked = false;
    }

    create() {
        this.bg = this.add.sprite(0, 0, 'background');
        this.bg.setOrigin(0, 0);
        this.bg.setInteractive();
        this.bg.on(Phaser.Input.Events.POINTER_DOWN, (pointer) => this.placeItem(pointer.x, pointer.y));

        this.pet = this.add.sprite(
            this.sys.game.config.width / 2, this.sys.game.config.height / 2,
            'pet', 0
        );
        this.pet.setInteractive({ draggable: true });
        this.pet.setDepth(1);

        this.anims.create({
            key: 'eat',
            frames: this.anims.generateFrameNames('pet', {
                frames: [1,2,3], 
            }),
            frameRate: 7,
            yoyo: true
        });

        this.input.on(Phaser.Input.Events.DRAG, (pointer, gameObj, x, y) => {
            gameObj.setPosition(x, y);
        });

        this.statsEvent = this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                this.updateStats(this.statsDecay);
            }
        })

        this.createUi();
    }

    createUi() {
        this.appleBtn = this.add.sprite(72, 580, 'apple').setInteractive();
        this.appleBtn.setData('stats', { health: 20, fun: 0 });
        this.appleBtn.on(Phaser.Input.Events.POINTER_DOWN, 
            () => this.pickItem(this.appleBtn));

        this.candyBtn = this.add.sprite(144, 580, 'candy').setInteractive();
        this.candyBtn.setData('stats', { health: -10, fun: 20 });
        this.candyBtn.on(Phaser.Input.Events.POINTER_DOWN, 
            () => this.pickItem(this.candyBtn));

        this.toyBtn = this.add.sprite(216, 580, 'toy').setInteractive();
        this.toyBtn.setData('stats', { health: 10, fun: 10 });
        this.toyBtn.on(Phaser.Input.Events.POINTER_DOWN, 
            () => this.pickItem(this.toyBtn));

        this.rotateBtn = this.add.sprite(288, 580, 'rotate').setInteractive();
        this.rotateBtn.setData('stats', { health: 5, fun: 10 });
        this.rotateBtn.on(Phaser.Input.Events.POINTER_DOWN, 
            () => this.rotatePet());

        this.statsText = this.add.text(20, 20, 'Health: 100 Fun: 100', {
            color: 'yellow',
            fontFamily: 'Arial',
            fontSize: '24px'
        });

        this.updateStats({ health: 0, fun: 0 });
    }

    setUiReady() {
        this.uiBlocked = false;
        this.selectedItem = null;
        this.appleBtn.setAlpha(1);
        this.candyBtn.setAlpha(1);
        this.toyBtn.setAlpha(1);
        this.rotateBtn.setAlpha(1);
    }

    pickItem(item) {
        if (this.uiBlocked) {
            return;
        }

        this.setUiReady();
        this.selectedItem = item;
        item.setAlpha(0.5);
    }

    placeItem(x, y) {
        if (this.uiBlocked) {
            return;
        }

        this.uiBlocked = true;

        const item = this.add.sprite(x, y, this.selectedItem.texture.key);

        this.tweens.add({
            targets: this.pet,
            x: x,
            y: y,
            duration: 500,
            onComplete: () => {
                item.destroy();
                this.updateStats(this.selectedItem.getData('stats'));
                this.pet.play('eat');

                this.pet.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.setUiReady();
                    this.pet.setFrame(0);
                });
            }
        });
    }

    rotatePet() {
        if (this.uiBlocked) {
            return;
        }

        this.rotateBtn.setAlpha(0.5);
        this.uiBlocked = true;

        this.tweens.add({
            targets: this.pet,
            angle: 360,
            duration: 300,
            onComplete: () => {
                this.updateStats(this.rotateBtn.getData('stats'));
                this.setUiReady();
            }
        });
    }

    updateStats(statsDelta) {
        this.stats.health += statsDelta.health;
        this.stats.fun += statsDelta.fun;

        if (this.stats.health <= 0 || this.stats.fun <= 0) {
            this.time.removeAllEvents();
            this.stats.health = 0;
            this.stats.fun = 0;
            this.gameOver();
        }

        this.statsText.setText(`Health: ${this.stats.health} Fun: ${this.stats.fun}`);
    }

    gameOver() {
        this.uiBlocked = true;
        this.pet.setFrame(4);

        this.time.addEvent({
            delay: 2000,
            repeat: 0,
            callback: () => this.scene.start('home')
        });
    }
}