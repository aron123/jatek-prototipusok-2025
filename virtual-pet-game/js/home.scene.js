class HomeScene extends Phaser.Scene {
    create() {
        const bg = this.add.sprite(0, 0, 'background');
        bg.setOrigin(0, 0);
        bg.setInteractive();
        bg.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.scene.start('game');
        });

        const welcomeText = this.add.text(0, 0, 'START GAME', {
            fontFamily: 'Arial',
            fontSize: '30px'
        });
        Phaser.Display.Align.In.Center(welcomeText, bg);

        const textBg = this.add.rectangle(0, 0, welcomeText.width + 40, welcomeText.height + 40, 0);
        textBg.setAlpha(0.5);
        Phaser.Display.Align.In.Center(textBg, bg);

        textBg.setDepth(1);
        welcomeText.setDepth(2);
    }
}