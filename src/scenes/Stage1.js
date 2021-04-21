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
            key: 'Fireball_Loop', frameRate: 8, repeat: -1,
            frames: this.anims.generateFrameNumbers('Stage1_Fireball', { start: 0, end: 3, first: 0}),
        });
        this.anims.create({ //Enemy1 Loop
            key: 'Enemy1_Loop', frameRate: 8, repeat: -1,
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
        this.SpawnCooldown = false; //Cooldown to determine if monsters can be spawned.
        
        //Group for storing monster projectiles.
        this.MonsterProjectiles = new Phaser.GameObjects.Group(this);

        //Collision modifiers (just a reminder. the values are actually referenced in the monster classes)
        this.CM = {};
        this.CM.Spaceship = 60;
        this.CM.Laser = {};
            this.CM.Laser.X = 3;
            this.CM.Laser.Y = 30;
        this.CM.Rocket = {};
            this.CM.Rocket.X = 31;
            this.CM.Rocket.Y = 52;
        this.CM.Enemy1 = 54;
        this.CM.Fireball = 16;

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
        //======================================================================
        // Collision
        //======================================================================
        var Temp; //temp group storage for in-loop referencing
        var Temp2; //^^^
        //Updating player projectile positions + collision.
        Temp = this.Player.Projectiles;
        Temp2 = this.Monsters;
        Temp.getChildren().forEach(function(Projectile) {
            Projectile.update();
            
            //Checking for collision (monsters)
            Temp2.getChildren().forEach(function(Monster) {
                if(Projectile.checkCollision(Monster)) {
                    console.log("Projectile hit!");
                    Temp.remove(Projectile, true, true); //Removing projectile
                    Temp2.remove(Monster, true, true); //Removing monster
                }
            });
            
            //Deleting off-screen drifters
            if(Projectile.y < -100) {
                Temp.remove(Projectile, true, true);
            }
        });

        //Updating monster positions + collisions.
        Temp = this.Monsters;
        Temp2 = this.Player;
        Temp.getChildren().forEach(function(Monster) {
            Monster.update();
            
            //Checking for collision (player ship only since player projectile checked before^^^)
            if(Monster.checkCollision(Temp2)) {
                console.log('Player hit!');
                Temp.remove(Monster, true, true); //Removing monster
            }
            
            //Deleting off-screen drifters
            if(Monster.y < -100 || //far off down
                Monster.y > game.config.height + 100 || //far off up
                Monster.x < -100 || //far off left
                Monster.x > game.config.width + 100) //far off right 
            {
                Temp.remove(Monster, true, true);
            }
        });

        //Updating monster projectile positions + collisions.
        Temp = this.MonsterProjectiles;
        Temp2 = this.Player;
        Temp.getChildren().forEach(function(Projectile) {
            Projectile.update();

            //Checking for collision (Player only)
            if(Projectile.checkCollision(Temp2)) {
                console.log('Player hit!');
                Temp.remove(Projectile, true, true);//Removing projectile
            }

             //Deleting off-screen drifters
            if(Projectile.y < -100 || //far off down
                Projectile.y > game.config.height + 100 || //far off up
                Projectile.x < -100 || //far off left
                Projectile.x > game.config.width + 100) //far off right 
            {
                Temp.remove(Projectile, true, true);
            }
        });

        //======================================================================
        // Others
        //======================================================================
        //Updating player (Spaceship)
        this.Player.update();

        //Drifting the background downwards until the top is reached.
        if(this.Background.y < this.Background.height + (2 * game.config.height)) {
            this.Background.y += 0.1;
        }

        //spawning monsters
        if(!this.SpawnCooldown) {
            this.SpawnCooldown = true;
            var temp = Math.floor(Math.random() * 100);
            if(temp % 2 == 0) {
                this.spawnRain();
                setTimeout(() => {
                    this.SpawnCooldown = false;
                }, 9000);
            } else {
                this.spawnWave();
                setTimeout(() => {
                    this.SpawnCooldown = false;
                }, 8000);
            }
        }

        //Flag checks
    }

    //Resetting for a new round (idk if phaser saves scene data so just in case).
    reset() {
        //Delete monster list.
        //Delete spaceship.
        //Delete boss if applicable.
    }

    //Spawn behaviors
    spawnWave() { //Summons a wave of monsters that go from one side of the screen to the other.
        //General data
        var monsterData = {};
        monsterData.data = {};
        monsterData.spawnX = 0;
        monsterData.spawnY = Math.floor(Math.random() * (game.config.height / 4)) + 50;
        monsterData.movespeed = Math.floor(Math.random() * 2) + 2;
        monsterData.player = this.Player;
        monsterData.behavior = 'wave';

        //Additional data
        monsterData.data.yDrift = (Math.floor(Math.random() * game.config.height / 8)) / game.config.width;
        //Movement direction
        var temp = Math.floor(Math.random() * 100);
        if(temp % 2 == 0) {
            monsterData.data.direction = -1;
            monsterData.spawnX = game.config.width + 60;
        } else {
            monsterData.data.direction = 1;
            monsterData.spawnX = -60;
        }
        
        //Fireball variance
        temp = Math.floor(Math.random() * 100);
        console.log(temp);
        if(temp % 2 == 0) {
            monsterData.data.fireball_behavior = 'target';
        } else {
            monsterData.data.fireball_behavior = 'fall';
        }

        var MonsterCount = Math.floor(Math.random() * 4) + 8; //Number of monsters spawned
        this.spawnEnemy1(monsterData, 400, 0, MonsterCount); //Calling recursive spawn function
    }

    spawnRain() { //Summons a wave of monsters that appear, then fall after a short delay.
        //General data.
        var monsterData = {};
        monsterData.data = {};
        monsterData.spawnX = Math.floor(Math.random() * (game.config.width - 120)) + 60;
        monsterData.spawnY = -60;
        monsterData.movespeed = 4;
        monsterData.player = this.Player;
        monsterData.behavior = 'rain';

        //Additional data
        monsterData.data.fallSpeed = Math.floor(Math.random() * 5) + 2;
        monsterData.data.stopY = (game.config.height / 8) + 40;

        //Fireball variance
        var temp = Math.floor(Math.random() * 100);
        if(temp % 2 == 0) {
            monsterData.data.fireball_behavior = 'target';
        } else {
            monsterData.data.fireball_behavior = 'fall';
        }

        var MonsterCount = Math.floor(Math.random() * 5) + 10; //Number of monsters spawned
        this.spawnEnemy1(monsterData, 400, 0, MonsterCount); //Calling recursive spawn function
    }

    spawnEnemy1(monsterData, delay, count, goal) { //recursively spawns monsters at a fixed delay.
        console.log("Count: " + count + " Goal: " + goal);
        if(count < goal) {
            this.Monsters.add( //create enemy
                new Enemy1(
                    this, monsterData.spawnX, monsterData.spawnY, 'Stage1_Enemy1', 0,
                    monsterData.behavior,
                    monsterData.movespeed,
                    (Math.floor(Math.random() * 3) + 2) * 500, //firerate
                    monsterData.player,
                    this.MonsterProjectiles,
                    monsterData.data
                ).setOrigin(0.5, 0.5).setScale(0.4).setDepth(15).play('Enemy1_Loop')
            );
            if(monsterData.behavior == 'rain') {
                monsterData.spawnX = Math.floor(Math.random() * (game.config.width - 120)) + 60;
            }
            setTimeout(() => {
                this.spawnEnemy1(monsterData, delay, count + 1, goal);
            }, delay);
        }
    }
}