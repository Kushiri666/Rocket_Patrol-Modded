class Stage1 extends Phaser.Scene {
    constructor() {
        super("Scene_Stage1");
    }

    preload() {
        
        // load images/tile sprites
        this.load.image('Explosion', './assets/Art/Explosion.png');
        this.load.image('Laser', './assets/Art/Laser.png');
        this.load.image('Stage1_Boss-Claw', './assets/Art/Purple_Boss-Claw.png');
        //this.load.image('Powerup', './assets/Powerup.png');
        
        // load spritesheet
        this.load.spritesheet("Spaceship", './assets/Art/Spaceship.png', 
            {frameWidth: 410, frameHeight: 410, startFrame: 0, endFrame: 2}
        );
        this.load.spritesheet('Rocket', './assets/Art/Rocket.png', 
            {frameWidth: 310, frameHeight: 350, startFrame: 0, endFrame: 1}
        );
        this.load.spritesheet('Stage1_Background', './assets/Art/Olympus.png', 
            {frameWidth: 640, frameHeight: 1280, startFrame: 0, endFrame: 1}
        );
        this.load.spritesheet('Stage1_Enemy1', './assets/Art/Enemy1.png', 
            {frameWidth: 280, frameHeight: 280, startFrame: 0, endFrame: 1}
        );
        this.load.spritesheet('Stage1_Enemy2', './assets/Art/Enemy2.png', 
            {frameWidth: 390, frameHeight: 390, startFrame: 0, endFrame: 1}
        );
        this.load.spritesheet('Stage1_Fireball', './assets/Art/Fireball.png', 
            {frameWidth: 320, frameHeight: 320, startFrame: 0, endFrame: 3}
        );
        this.load.spritesheet('Stage1_Boss-Head', './assets/Art/Purple_Boss-Head.png', 
            {frameWidth: 470, frameHeight: 470, startFrame: 0, endFrame: 16}
        );
    }

    create() {
        //Animations config
        this.anims.create({ //Rocket Loop
            key: 'Rocket_Loop',
            frames: this.anims.generateFrameNumbers('Rocket', { start: 0, end: 1, first: 0}),
            frameRate: 8
        });
        this.anims.create({ //Fireball Loop
            key: 'Fireball_Loop',
            frames: this.anims.generateFrameNumbers('Stage1_Fireball', { start: 0, end: 3, first: 0}),
            frameRate: 8
        });
        this.anims.create({ //Enemy1 Loop
            key: 'Enemy1_Loop',
            frames: this.anims.generateFrameNumbers('Stage1_Enemy1', { start: 0, end: 1, first: 0}),
            frameRate: 8
        });
        this.anims.create({ //Enemy2 Loop
            key: 'Enemy2_Loop',
            frames: this.anims.generateFrameNumbers('Stage1_Enemy2', { start: 0, end: 1, first: 0}),
            frameRate: 0
        });
        this.anims.create({ //Background Loop
            key: 'Olympus',
            frames: this.anims.generateFrameNumbers('Stage1_Background', { start: 0, end: 1, first: 0}),
            frameRate: 1,
            repeat: -1
        });

        //Soundtrack config
        this.Music_Stage1 = this.sound.add("Music_Stage1");
        this.Stage1_Config = {
            mute: false,
            volume: 0.25,
            loop: true,
            delay: 0
        };
        this.Music_Boss1 = this.sound.add("Music_Boss1");
        this.Boss1_Config = {
            mute: false,
            volume: 0.5,
            loop: true,
            delay: 0
        };
        this.Music_Boss2 = this.sound.add("Music_Boss2");
        this.Boss2_Config = {
            mute: false,
            volume: 0.5,
            loop: true,
            delay: 0
        };
        


        //Loading in background
        this.Background = this.add.sprite(
            game.config.width/2,
            game.config.height,
            "Stage1_Background"
        ).setOrigin(0.5, 1).setScale(game.config.width / 640);

        //Spawning in player
        this.Player = new Spaceship(
            this, 
            game.config.width/2, 
            this.game.config.height - 100, 
            "Spaceship", 
            0
        ).setOrigin(0.5, 0.5).setScale(0.3);

        // define keys
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        //Flags
        this.HeardRoar = false;
        this.ReachedPinnacle = false;
        this.EnteredBoss = false;
        this.clearedForest = false;
        this.GameStart = false;

        //Starting background animation.
        this.Background.play("Olympus");

        //Playing starting music
        this.Music_Stage1.play(this.Stage1_Config);
    }

    update() {
        this.Player.update();
        if(this.Background.y < this.Background.height + (2 * game.config.height)) {
            this.Background.y += 0.1;
        }

    }
}