import Phaser from "phaser";

const loadingScene = new Phaser.Scene('Loading');

loadingScene.preload = function() {
    const logo = this.add.sprite(this.sys.game.config.width / 2, 250, 'logo');

    // progress bar background
    const bgBar = this.add.graphics();

    const barW = 150;
    const barH = 30;

    bgBar
        .setPosition(this.sys.game.config.width / 2 - barW / 2, this.sys.game.config.height / 2 - barH / 2);
    bgBar.fillStyle(0xF5F5F5, 1);
    bgBar.fillRect(0, 0, barW, barH)

    const progressBar = this.add.graphics();
    progressBar.setPosition(this.sys.game.config.width / 2 - barW / 2, this.sys.game.config.height / 2 - barH / 2);

    this.load.on('progress', function(value) {
        // clearing progress bar (so we can draw it again)
        progressBar.clear();

        progressBar.fillStyle(0x9AD98D, 1);
        // draw rectangle

        progressBar.fillRect(0, 0, value * barW, barH);
    }, this);

    progressBar.depth = 1;

    // load assets
    this.load.image('backyard', 'assets/images/backyard.png');
    this.load.image('apple', 'assets/images/apple.png');
    this.load.image('candy', 'assets/images/candy.png');
    this.load.image('rotate', 'assets/images/rotate.png');
    this.load.image('toy', 'assets/images/rubber_duck.png');

    // load spritesheets
    this.load.spritesheet('pet', 'assets/images/pet.png', {
        frameWidth: 97,
        frameHeight: 83,
        margin: 1,
        spacing: 1
    });

    // testing progress bar
    for (let i = 0; i < 1000; i++) {
        this.load.image('test' + i, 'assets/images/apple.png');
    }
}

loadingScene.create = function() {
    // animation
    this.anims.create({
        key: 'funnyfaces',
        frames: this.anims.generateFrameNames('pet', { frames: [1, 2, 3] }),
        frameRate: 7,
        repeat: 0,
        yoyo: true
    });

    this.scene.start('Home');
}

export default loadingScene;