import Phaser from 'phaser';

const bootScene = new Phaser.Scene('Boot');

bootScene.preload = function () {
    this.load.image('logo', 'assets/images/rubber_duck.png');
}

bootScene.create = function () {
    this.scene.start('Loading');
}

export default bootScene;