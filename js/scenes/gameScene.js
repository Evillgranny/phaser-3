import Phaser from 'phaser';

// create a new scene
const gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function() {
    this.stats = {
        health: 100,
        fun: 100,
    }

    // decay params
    this.decayRates = {
        health: -5,
        fun: -2,
    }
};

// executed once, after assets were loaded
gameScene.create = function() {
    // game background
    const bg = this.add.sprite(0, 0, 'backyard')
        .setOrigin(0, 0)
        .setInteractive();

    bg.on('pointerdown', this.placeItem, this);

    this.pet = this.add.sprite(100, 200, 'pet', 2).setInteractive();
    this.pet.setDepth(1);

    // make pet draggable
    this.input.setDraggable(this.pet);

    // follow pointer when dragging
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.createUI();
    this.createHud();
    this.refreshHud();

    // decay health and fun over time
    this.timedEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1, // it will repeat forever
        callbackScope: this,
        callback: function () {
            this.updateStats(this.decayRates);
        },
    });
};

gameScene.createUI = function() {
    // buttons
    this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
    this.appleBtn.customStats = { health: 20, fun: 0 };
    this.appleBtn.on('pointerdown', this.pickItem);

    this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
    this.candyBtn.customStats = { health: -10, fun: 10 };
    this.candyBtn.on('pointerdown', this.pickItem);

    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
    this.toyBtn.customStats = { health: 0, fun: 15 };
    this.toyBtn.on('pointerdown', this.pickItem);

    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();

    this.rotateBtn.on('pointerdown', this.rotatePet);
    this.rotateBtn.customStats = { health: 0, fun: 20 };
    this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];

    this.uiBlocked = false;

    // refresh ui
    this.uiReady();

}

// rotate pet
gameScene.rotatePet = function() {
    if (this.scene.uiBlocked) {
        return;
    }

    this.scene.uiReady();

    this.scene.uiBlocked = true;

    this.alpha = 0.5;

    const rotateTween = this.scene.tweens.add({
        targets: this.scene.pet,
        duration: 600,
        angle: 720,
        pause: false,
        callbackScope: this,
        onComplete: function(tween, sprites) {
            this.scene.updateStats(this.customStats);

            this.scene.uiReady();
        }
    });
};

gameScene.pickItem = function () {
    if (this.uiBlocked) {
        return;
    }

    this.scene.uiReady();

    this.scene.selectedItem = this;

    // change tansparency
    this.alpha = 0.5;

    console.log(111, this)
    console.log('item picked', this.texture.key);
}

gameScene.uiReady = function () {
    this.selectedItem = null;

    this.buttons.forEach(function (button) {
        button.alpha = 1;
    });

    this.uiBlocked = false;
}

gameScene.placeItem = function (pointer, localX, localY) {
    // check that an item was selected
    if (!this.selectedItem) {
        return;
    }

    // ui must be unblocked
    if (this.uiBlocked) {
        return;
    }

    // create a new item in the position the player clicked/tapped
    const newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);

    // block UI
    this.uiBlocked = true;

    // pet movement (tween)
    const petTween = this.tweens.add({
        targets: this.pet,
        duration: 500,
        x: newItem.x,
        y: newItem.y,
        callbackScope: this,
        paused: false,
        onComplete: function (tween, sprites) {
            // destroy item
            newItem.destroy();

            this.pet.on('animationcomplete', function () {
                // set pet back to neutral face
                this.pet.setFrame(0);
                // clear ui
                this.uiReady();
            }, this);

            // play animation
            this.pet.play('funnyfaces');

            this.updateStats(this.selectedItem.customStats);
        },
    });

    // pet stats
    // this.stats.health += this.selectedItem.customStats.health;
    // this.stats.fun += this.selectedItem.customStats.fun;
}

gameScene.createHud = function () {
    // health stat
    this.healthText = this.add.text(20,20, 'Health: ', {
        font: '26px Arial',
        fill: '#ffffff'
    });

    // fun stat
    this.funText = this.add.text(170,20, 'Fun : ', {
        font: '26px Arial',
        fill: '#ffffff'
    });
}

// show current value of heath and fun
gameScene.refreshHud = function () {
    this.healthText.setText(`Health: ${this.stats.health}`);
    this.funText.setText(`Fun: ${this.stats.fun}`);
}

gameScene.updateStats = function(statDiff) {
    // flag to see if it's game over
    let isGameOver = false;

    for (const stat in statDiff) {
        if (statDiff.hasOwnProperty(stat)) {
            this.stats[stat] += statDiff[stat];
            if (this.stats[stat] < 0) {
                isGameOver = true;
                this.stats[stat] = 0;
            }
        }
    }

    this.refreshHud();

    if (isGameOver) {
        this.gameOver();
    }
}

gameScene.gameOver = function () {
    // block UI
    this.uiBlocked = true;

    // change frame the pet
    this.pet.setFrame(4);

    // keep the game on for some time and then restart
    this.time.addEvent({
        delay: 2000,
        repeat: 0, // it will repeat forever
        callbackScope: this,
        callback: function () {
            this.scene.start('Home');
        },
    });
}

export default gameScene;
