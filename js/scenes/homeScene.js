import Phaser from 'phaser';

// create a new scene
const homeScene = new Phaser.Scene('Home');

homeScene.create = function() {
    // game background, with active input
    const bg = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    const text = this.add.text(gameWidth / 2, gameHeight / 2, 'Virtual Pet', {
        font: '40px Arial',
        fill: '#ffffff',
    }).setOrigin(0.5);

    text.depth = 1;

    const textBg = this.add.graphics();
    textBg.fillStyle(0x000000, 0.5);
    textBg.fillRect(
        gameWidth / 2 - text.width / 2 - 10,
        gameHeight / 2 - text.height / 2 - 10,
        text.width + 20,
        text.height + 20
    );

    bg.on('pointerdown', function() {
        this.scene.start('Game');
    }, this);
};

export default homeScene;