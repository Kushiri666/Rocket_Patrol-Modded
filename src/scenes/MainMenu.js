class MainMenu extends Phaser.Scene {
    constructor() {
        super("Scene_MainMenu");
    }

    preload() {
        //Loading Music
        this.load.audio('Music_Stage1', './assets/Sound/Stage1.wav');
        this.load.audio('Music_Boss1', './assets/Sound/Boss1.wav');
        this.load.audio('Music_Boss2', './assets/Sound/Boss2.wav');
        this.load.audio('Music_Menu', './assets/Sound/Menu.wav');

        //Loading Sfx
        this.load.audio('Sfx_Player_Death', './assets/Sound/Player-Death.wav');
        this.load.audio('Sfx_Player_Lose', './assets/Sound/Game_Over.wav');
        this.load.audio('Sfx_Player_Laser', './assets/Sound/Laser.wav');
        this.load.audio('Sfx_Player_Powerup', './assets/Sound/Powerup.wav');
        this.load.audio('Sfx_Explosion', './assets/Sound/Explosion.wav');
        this.load.audio('Sfx_Boss_Enter', './assets/Sound/EnterBoss.wav');
        this.load.audio('Sfx_Boss_Roar', './assets/Sound/Roar.wav');
        this.load.audio('Sfx_Boss_Hit', './assets/Sound/Hit.wav');
        this.load.audio('Sfx_Boss_Laser', './assets/Sound/Boss_Laser.wav');
    }

    create() {
        //Configuring Menu
        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F6DF7A',
            color: '#000000',
            align: 'right',
            padding: {
                top: 10,
                bottom: 10,
            },
            fixedWidth: 0
        }

        //Generating Menu
        this.add.text(game.config.width/2, 
            borderUISize + borderPadding, 
            'ROCKET PATROL - Modded Edition', 
            menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 
            borderUISize + borderPadding + 50, 
            'Modified to resemble a classic shoot em up.', 
            menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 
            borderUISize + borderPadding + 150, 
            'Use A and D to move side to side.', 
            menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 
            borderUISize + borderPadding + 200, 
            'Use the spacebar to fire your lasers!', 
            menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 
            borderUISize + borderPadding + 250, 
            'Collect powerups to upgrade your ship!', 
             menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 
            borderUISize + borderPadding + 300, 
            'Defeat enemies to gain points!', 
            menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, 
            borderUISize + borderPadding + 450, 
            'Begin the game by pressing Space', 
            menuConfig).setOrigin(0.5);

        menuConfig.backgroundColor = '#00FF00';
        menuConfig.color = '#000';

        //Defining Keys (Relative to this scene Only)
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);

        //Configuring music
        this.Music_Menu = this.sound.add("Music_Menu");
        this.Menu_Config = {
            mute: false,
            volume: 0.5,
            loop: true,
            delay: 0
        };

        //Playing music
        this.Music_Menu.play(this.Menu_Config);
    }

    update() {
        //Start game
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            console.log("Space pressed");
            this.Music_Menu.stop();
            this.scene.start('Scene_Stage1');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyW)) {
            console.log("Space pressed");
            //this.scene.start('Scene_Stage1');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyS)) {
            console.log("Space pressed");
            //this.scene.start('Scene_Stage1');    
        }
    }
}