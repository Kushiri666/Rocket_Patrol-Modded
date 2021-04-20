let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 480,
    scene: [MainMenu, Stage1]
  }

let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyW, keyA, keyS, keyD, keySpace