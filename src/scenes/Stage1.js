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
            key: 'Rocket_Loop', frameRate: 8, repeat: -1,
            frames: this.anims.generateFrameNumbers('Rocket', { start: 0, end: 1, first: 0}),
        });
        this.anims.create({ //Fireball Loop
            key: 'Fireball_Loop', frameRate: 8,
            frames: this.anims.generateFrameNumbers('Stage1_Fireball', { start: 0, end: 3, first: 0}),
        });
        this.anims.create({ //Enemy1 Loop
            key: 'Enemy1_Loop', frameRate: 8,
            frames: this.anims.generateFrameNumbers('Stage1_Enemy1', { start: 0, end: 1, first: 0}),
        });
        this.anims.create({ //Background Loop
            key: 'Olympus', frameRate: 1, repeat: -1,
            frames: this.anims.generateFrameNumbers('Stage1_Background', { start: 0, end: 1, first: 0}),
        });

        //Soundtrack config
        this.Music_Stage1 = this.sound.add("Music_Stage1"); //Pre-boss music
        this.Stage1_Config = {mute: false, volume: 0.25, loop: true, delay: 0};

        this.Music_Boss1 = this.sound.add("Music_Boss1"); //boss phase 1
        this.Boss1_Config = {mute: false, volume: 0.25, loop: true, delay: 0};

        this.Music_Boss2 = this.sound.add("Music_Boss2"); //boss phase 2
        this.Boss2_Config = {mute: false, volume: 0.25, loop: true, delay: 0};

        //Sfx config
        this.Sfx_Player_Laser = this.sound.add("Sfx_Player_Laser"); //basic laser shooting sfx
        this.Laser_Config = {mute: false, volume: 0.2, loop: false,};

        this.Sfx_Player_Rocket = this.sound.add("Sfx_Player_Death"); //rocket shooting sfx
        this.Rocket_Config = {mute: false, volume: 0.5, loop: false,};

        //Background config
        this.Background = this.add.sprite(
            game.config.width/2, game.config.height, "Stage1_Background"
        ).setOrigin(0.5, 1).setScale(game.config.width / 640);

        //Group for storing created monsters.
        this.Monsters = new Phaser.GameObjects.Group(this);

        //Spawning in player
        this.Player = new Spaceship(
            this, game.config.width/2, game.config.height - 100, "Spaceship", 0,
            this.Sfx_Player_Laser,
            this.Laser_Config,
            this.Sfx_Player_Rocket,
            this.Rocket_Config
        ).setOrigin(0.5, 0.5).setScale(0.3).setDepth(20);

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

        //Debug purposes
    }

    update() {
        //Updating Spaceship
        this.Player.update();

        //Updating projectile positions + Checking for collision.
        var Temp = this.Player.Projectiles
        Temp.getChildren().forEach(function(Projectile) {
            Projectile.update();
            if(Projectile.y < -100) { //Deleting off-screen drifters
                Temp.remove(Projectile, true, true);
            }
        });

        //Drifting the background downwards until the top is reached.
        if(this.Background.y < this.Background.height + (2 * game.config.height)) {
            this.Background.y += 0.1;
        }
    }

    checkCollision(Obj1, Obj2) {
        if(true) {
            return true;
        } else {
            return false;
        }
    }
}