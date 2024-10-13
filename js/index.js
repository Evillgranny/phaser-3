import Phaser from "phaser";
import gameScene from './scenes/gameScene.js';
import homeScene from './scenes/homeScene.js';
import loadingScene from './scenes/loadingScene.js';
import bootScene from './scenes/bootScene.js';

// our game's configuration
const config = {
    type: Phaser.AUTO,
    width: 360,
    height: 640,
    scene: [bootScene, loadingScene, homeScene, gameScene],
    title: 'Virtual Pet',
    pixelArt: false,
    backgroundColor: 'ffffff'
};

// create the game, and pass it the configuration
new Phaser.Game(config);