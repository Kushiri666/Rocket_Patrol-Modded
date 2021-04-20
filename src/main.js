let config = {
    type: Phaser.AUTO,
    width: 1600,
    height: 900,
    scene: [MainMenu, Stage1],
    scale: {
      parent: 'mygame',
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  }

let game = new Phaser.Game(config);
// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

// reserve keyboard vars
let keyW, keyA, keyS, keyD, keySpace