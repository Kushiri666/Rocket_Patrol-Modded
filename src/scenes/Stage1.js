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
        //======================================================================
        // Loadout
        //======================================================================
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
        this.anims.create({ //Enemy2 Loop
            key: 'Enemy2_Loop', frameRate: 8, repeat: -1,
            frames: this.anims.generateFrameNumbers('Stage1_Enemy2', { start: 0, end: 1, first: 0}),
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

        this.Music_Menu = this.sound.add("Music_Menu");
        this.Menu_Config = {mute: false, volume: 0.5, loop: true, delay: 0};

        //Sfx config
        this.Sfx_Player_Laser = this.sound.add("Sfx_Player_Laser"); //basic laser shooting sfx
        this.Laser_Config = {mute: false, volume: 0.2, loop: false,};

        this.Sfx_Player_Rocket = this.sound.add("Sfx_Player_Death"); //rocket shooting sfx
        this.Rocket_Config = {mute: false, volume: 0.5, loop: false,};

        this.Sfx_Explosion = this.sound.add("Sfx_Explosion");
        this.Explosion_Config = {mute: false, volume: 0.2, loop: false,};

        this.Sfx_Boss_Intro = this.sound.add("Sfx_Boss_Enter"); //Boss intro roar
        this.Intro_Congig = {mute: false, volume: 1, loop: false,};

        //Background config
        this.Background = this.add.sprite(
            game.config.width/2, game.config.height, "Stage1_Background"
        ).setOrigin(0.5, 1).setScale(game.config.width / 640);

        //======================================================================
        // Technical
        //======================================================================
        //Group for storing created monsters.
        this.Monsters = new Phaser.GameObjects.Group(this);
        this.SpawnCooldown = false; //Cooldown to determine if monsters can be spawned.
        
        //Group for storing monster projectiles.
        this.MonsterProjectiles = new Phaser.GameObjects.Group(this);
            
        // define keys
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Flags
        this.GameOver = false;
        this.reachedMidway = false;
        this.ApproachingTop = false;
        this.PlayingRoar = false;
        this.FinishedRoar = false;
        this.EnteringBoss = false;
        this.EnteredBoss = false;
        
        //Score Counter
        this.Score = 0;

        //======================================================================
        // Gui
        //======================================================================
        //Corner score box
        this.Text_Box = this.add.rectangle(game.config.width/2, 5, 
            game.config.width/2, 
            game.config.height/16, 
            0xF6DF7A
        ).setOrigin(0.5, 0).setDepth(49);
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            color: '#000000',
            align: 'left',
            padding: {
            top: 5,
            bottom: 5,
            left: 5
            },
        }
        this.Text_Stats = this.add.text(
            this.Text_Box.x,
            this.Text_Box.y, 
            "Score: " + this.Score, 
            scoreConfig
        ).setDepth(50).setOrigin(0.5, 0);


        //======================================================================
        // Starting game
        //======================================================================
        //Spawning in player
        this.Player = new Spaceship(
            this, game.config.width/2, game.config.height - 100, "Spaceship", 0,
            this.Sfx_Player_Laser,
            this.Laser_Config,
            this.Sfx_Player_Rocket,
            this.Rocket_Config
        ).setOrigin(0.5, 0.5).setScale(0.3).setDepth(20);

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
        var Temp = this; //temp scene storage for in-loop referencing
        //Updating player projectile positions + collision.
        this.Player.Projectiles.getChildren().forEach(function(Projectile) {
            Projectile.update();
            
            //Checking for collision (monsters)
            Temp.Monsters.getChildren().forEach(function(Monster) {
                if(Projectile.checkCollision(Monster)) {
                    Temp.Player.Projectiles.remove(Projectile, true, true); //Removing projectile
                    Monster.health -= Projectile.damage; //reducing monster hp
                    if(Monster.health < 1){
                        Temp.makeExplosion(Monster, 0.6, 500); //Explosion animation
                        Temp.Score += Monster.score;  //Incrementing points
                        Temp.Monsters.remove(Monster, true, true); //Removing monster
                    } else {
                        Temp.makeExplosion(Monster, 0.2, 500); //Explosion animation
                    }
                }
            });
            
            //Deleting off-screen drifters
            if(Projectile.y < -100) {
                Temp.Player.Projectiles.remove(Projectile, true, true);
            }
        });

        //Updating monster positions + collisions.
        this.Monsters.getChildren().forEach(function(Monster) {
            Monster.update();
            
            //Checking for collision (player ship only since player projectile checked before^^^)
            if(Monster.checkCollision(Temp.Player)) {
                Temp.Sfx_Explosion.play(Temp.Explosion_Config); //Play sound
                    
                //Explosion animation
                let boom = Temp.add.sprite(Monster.x, Monster.y, "Explosion").setOrigin(0.5, 0.5).setScale(0.2);
                Temp.tweens.add({ //Fading away explosion
                    targets: boom,
                    alpha: 0,
                    duration: 500
                });
                setTimeout(() => { //Delaying explosion sprite deletion
                    boom.destroy();
                }, 500);

                Temp.Player.Health -= 1;  //Incrementing points
                Temp.Monsters.remove(Monster, true, true); //Removing monster
            }
            
            //Deleting off-screen drifters
            if(Monster.y < -100 || //far off down
                Monster.y > game.config.height + 100 || //far off up
                Monster.x < -100 || //far off left
                Monster.x > game.config.width + 100) //far off right 
            {
                Temp.Monsters.remove(Monster, true, true);
            }
        });

        //Updating monster projectile positions + collisions.
        Temp.MonsterProjectiles.getChildren().forEach(function(Projectile) {
            Projectile.update();

            //Checking for collision (Player only)
            if(Projectile.checkCollision(Temp.Player)) {
                Temp.Sfx_Explosion.play(Temp.Explosion_Config); //Play sound
                    
                //Explosion animation
                let boom = Temp.add.sprite(Projectile.x, Projectile.y, "Explosion").setOrigin(0.5, 0.5).setScale(0.2);
                Temp.tweens.add({ //Fading away explosion
                    targets: boom,
                    alpha: 0,
                    duration: 500
                });
                setTimeout(() => { //Delaying explosion sprite deletion
                    boom.destroy();
                }, 500);

                Temp.Player.Health -= 1;  //Incrementing points
                Temp.MonsterProjectiles.remove(Projectile, true, true);//Removing projectile
            }

             //Deleting off-screen drifters
            if(Projectile.y < -100 || //far off down
                Projectile.y > game.config.height + 100 || //far off up
                Projectile.x < -100 || //far off left
                Projectile.x > game.config.width + 100) //far off right 
            {
                Temp.MonsterProjectiles.remove(Projectile, true, true);
            }
        });

        //======================================================================
        // Others
        //======================================================================
        //Updating player (Spaceship)
        this.Player.update();

        //Updating text
        this.Text_Stats.setText("Score: " + this.Score + "  " + //Score
            "Ship Health: " + this.Player.Health + "  " +            //Health
            "Ship Rank: " + this.Player.Level)                       //Ship Tier

        //Drifting the background downwards until the top is reached.
        if(this.Background.y < this.Background.height + (2 * game.config.height) &&
            !this.GameOver) {
            this.Background.y += 0.1;
        }
        //Setting background flags
        if(this.Background.y > this.Background.height + game.config.height &&
            !this.reachedMidway) {
            this.reachedMidway = true;
        }
        if(this.Background.y > this.Background.height + (1.8 * game.config.height) &&
            !this.ApproachingTop) {
            this.ApproachingTop = true;
        }

        //Game Over check
        if(this.Player.Health < 1 &&
            !this.GameOver) {
            this.GameOver = true;

            //Clearing monsters
            this.Monsters.clear(true, true);
            this.MonsterProjectiles.clear(true, true);
            
            //Fading music
            let Target;
            if(!this.reachedMidway) {
                Target = this.Music_Stage1;
            } 
            this.tweens.add({ //Fading away music
                targets: Target,
                volume: 0,
                duration: 1000
            });

            //Explosion effect1
            this.makeExplosion(this.Player, 0.2, 500);
            //Explosion effect2
            setTimeout(() => {
                this.makeExplosion(this.Player, 0.2, 500);
                //Explosion effect3
                setTimeout(() => { 
                    this.makeExplosion(this.Player, 0.2, 500);
                    //Explosion effect4
                    setTimeout(() => {
                        this.makeExplosion(this.Player, 0.2, 500);
                        //Explosion effect5
                        setTimeout(() => {
                            this.makeExplosion(this.Player, 0.8, 2000);
                            setTimeout(() => {
                                //Destroying ship
                                this.Player.destroy();

                                //Playing Menu music
                                setTimeout(() => {
                                    this.Music_Menu.play(this.Menu_Config);
                                }, 4000);
                            }, 100);
                        }, 1000);
                    }, 500);
                }, 500);
            }, 500);
        }

        //spawning monsters --Disabled during boss--
        if(!this.SpawnCooldown &&
            !this.ApproachingTop &&
            !this.GameOver) {
            this.SpawnCooldown = true;
            //Spawning Enemy1
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
            //Spawning Enemy2
            if(this.reachedMidway) {
                temp = Math.floor(Math.random() * 100);
                if(temp > 50) {
                    setTimeout(() => {
                        this.spawnEnemy2();
                    }, 2000);
                }   
            }
        }

        //Flag Checks
        if(this.ApproachingTop && //Approaching boss zone
            !this.PlayingRoar) {
            this.PlayingRoar = true;

            this.Sfx_Boss_Intro.play(this.Intro_Congig);//Playing boss intro roar
            this.tweens.add({ //Fading away music
                targets: this.Music_Stage1,
                volume: 0,
                duration: 1000
            });
            setTimeout(() => {
                this.FinishedRoar = true;
            }, 8000);
        }

        if(this.FinishedRoar &&
            !this.EnteringBoss) {
            this.EnteringBoss = true;

        }
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
        if(this.GameOver) {return false;};
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

    spawnEnemy2() { //Spawns a single enemy2
        if(this.GameOver) {return false;}
        var direction = Math.floor(Math.random() * 100);
        if(direction % 2 == 0) {
            direction = -1;
        } else {
            direction = 1
        }

        this.Monsters.add( //create enemy
            new Enemy2(this, -60, -60, 'Stage1_Enemy2', 0,
                this.Player,
                this.MonsterProjectiles,
                direction
            ).setScale(0.5).setOrigin(0.5, 0.5).setDepth(13).play('Enemy2_Loop')
        );
    }

    spawnBoss() { //Spawns the boss head along with it's 2 hands
        
    }

    //Makes an explosion
    makeExplosion(Target, scale, duration) {
        this.Sfx_Explosion.play(this.Explosion_Config);
        let boom = this.add.sprite(Target.x, Target.y, "Explosion").setOrigin(0.5, 0.5).setScale(scale).setDepth(100);
        this.tweens.add({targets: boom, alpha: 0, duration: duration});
        setTimeout(() => {boom.destroy();}, duration);
    }
}