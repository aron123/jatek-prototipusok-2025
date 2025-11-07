class LoadingScene extends Phaser.Scene {
    preload() {
        this.load.image('background', 'assets/backyard.png');
        this.load.image('apple', 'assets/apple.png');
        this.load.image('candy', 'assets/candy.png');
        this.load.image('toy', 'assets/rubber_duck.png');
        this.load.image('rotate', 'assets/rotate.png');

        this.load.spritesheet('pet', 'assets/pet.png', {
            frameWidth: 97,
            frameHeight: 83,
            margin: 1,
            spacing: 1
        });

        for (let i=0; i < 250; i++) {
            this.load.image('background' + i, 'assets/backyard.png');
        }

        const bg = this.add.rectangle(0, 0, this.sys.game.config.width, this.sys.game.config.height, 0xffffff);
        bg.setOrigin(0, 0);

        const bgBar = this.add.rectangle(0, 0, 250, 40, 0xc4c0c0);
        Phaser.Display.Align.In.Center(bgBar, bg);

        const progressBar = this.add.rectangle(0, 0, 0, 40, 0x109c00);
        progressBar.setOrigin(0, 0);
        Phaser.Display.Align.To.LeftTop(progressBar, bgBar);

        this.load.on(Phaser.Loader.Events.PROGRESS, (progress) => {
            progressBar.setSize(250 * progress, 40);
        });
    }

    create() {
        this.scene.start('home');
    }
}