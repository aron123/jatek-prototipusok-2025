/// <reference path="./types/index.d.ts" />

class GameScene extends Phaser.Scene {
    init() {
        this.playerSpeed = 200;
        this.jumpSpeed = -600;
    }

    preload() {
        this.load.image('barrel', 'assets/barrel.png');
        this.load.image('block', 'assets/block.png');
        this.load.image('gorilla', 'assets/gorilla3.png');
        this.load.image('ground', 'assets/ground.png');
        this.load.image('platform', 'assets/platform.png');

        this.load.spritesheet('fire', 'assets/fire_spritesheet.png', {
            frameWidth: 20,
            frameHeight: 21,
            margin: 1,
            spacing: 1
        });

        this.load.spritesheet('player', 'assets/player_spritesheet.png', {
            frameWidth: 28,
            frameHeight: 30,
            margin: 1,
            spacing: 1
        });

        this.load.json('levelData', 'assets/level.json');
    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {
                frames: [0, 1, 2]
            }),
            frameRate: 12,
            yoyo: true,
            repeat: -1
        });

        this.anims.create({
            key: 'burn',
            frames: this.anims.generateFrameNames('fire', {
                frames: [0, 1]
            }),
            frameRate: 4,
            repeat: -1
        });

        this.setupLevel();
        this.setupSpawner();

        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerdown',
            (pointer) => console.log(pointer.x, pointer.y));
    }

    update() {
        const onGround = this.player.body.blocked.down;

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-this.playerSpeed);
            this.player.setFlipX(false);

            if (onGround) {
                this.player.anims.play('walk', true);
            }
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(this.playerSpeed);
            this.player.setFlipX(true);

            if (onGround) {
                this.player.anims.play('walk', true);
            }
        } else {
            this.player.body.setVelocityX(0);
            this.player.setFlipX(false);
            this.player.anims.stop();
            if (onGround) {
                this.player.setFrame(3);
            }
        }

        if (onGround && (this.cursors.space.isDown || this.cursors.up.isDown)) {
            this.player.body.setVelocityY(this.jumpSpeed);
            this.player.anims.stop();
            this.player.setFrame(2);
        }
    }

    setupLevel() {
        this.levelData = this.cache.json.get('levelData');

        this.player = this.add.sprite(
            this.levelData.player.x, this.levelData.player.y,
            'player', 3);
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);

        this.platforms = this.add.group();

        for (const platform of this.levelData.platforms) {
            const width = this.textures.get(platform.texture).get(0).width;
            const height = this.textures.get(platform.texture).get(0).height;
            const platformSprite = this.add.tileSprite(
                platform.x, platform.y, platform.tileCount * width, height,
                platform.texture);
            platformSprite.setOrigin(0, 0);
            this.physics.add.existing(platformSprite, true);
            this.platforms.add(platformSprite);
        }

        this.physics.add.collider(this.player, this.platforms);

        this.fires = this.add.group();
        for (const fire of this.levelData.fires) {
            const fireSprite = this.add.sprite(fire.x, fire.y, 'fire');
            this.physics.add.existing(fireSprite, true);
            this.fires.add(fireSprite);
            fireSprite.anims.play('burn');
        }

        const gorilla = this.add.sprite(
            this.levelData.enemy.x, this.levelData.enemy.y,
            'gorilla');
        this.physics.add.existing(gorilla);
        this.physics.add.collider(gorilla, this.platforms);

        this.physics.add.overlap(this.player,
            [this.fires, gorilla],
            () => this.scene.restart());
    }

    setupSpawner() {
        const barrels = this.physics.add.group({
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 0.1
        });

        this.physics.add.collider(barrels, this.platforms);
        this.physics.add.overlap(this.player, barrels,
            () => this.scene.restart()
        );

        this.time.addEvent({
            delay: this.levelData.spawner.interval,
            repeat: -1,
            callback: () => {
                const barrel = this.add.sprite(
                    this.levelData.enemy.x, this.levelData.enemy.y,
                    'barrel');
                this.physics.add.existing(barrel);
                barrels.add(barrel);
                barrel.body.setVelocityX(this.levelData.spawner.speed);
                
                this.time.addEvent({
                    delay: this.levelData.spawner.lifespan,
                    repeat: 0,
                    callback: () => barrel.destroy()
                });
            }
        });
    }
}

const gameScene = new GameScene('game');
const game = new Phaser.Game({
    width: 360,
    height: 640,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 1000
            },
            debug: true
        }
    }
});