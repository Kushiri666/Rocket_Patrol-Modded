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
        this.Boss1_Config = {mute: false, volume: 0.5, loop: true, delay: 0};

        this.Music_Boss2 = this.sound.add("Music_Boss2"); //boss phase 2
        this.Boss2_Config = {mute: false, volume: 0.5, loop: true, delay: 0};

        this.Music_Menu = this.sound.add("Music_Menu");
        this.Menu_Config = {mute: false, volume: 0.5, loop: true, delay: 0};

        //Sfx config
        this.Sfx_Player_Laser = this.sound.add("Sfx_Player_Laser"); //basic laser shooting sfx
        this.Laser_Config = {mute: false, volume: 0.2, loop: false,};

        this.Sfx_Player_Rocket = this.sound.add("Sfx_Player_Death"); //rocket shooting sfx
        this.Rocket_Config = {mute: false, volume: 0.5, loop: false,};

        this.Sfx_Explosion = this.sound.add("Sfx_Explosion");
        this.Explosion_Config = {mute: false, volume: 0.15, loop: false,};

        this.Sfx_Boss_Intro = this.sound.add("Sfx_Boss_Enter"); //Boss intro roar
        this.Intro_Config = {mute: false, volume: 1, loop: false,};

        this.Sfx_Boss_Roar = this.sound.add("Sfx_Boss_Roar"); //Boss battle roar
        this.Roar_Config = {mute: false, volume: 0.2, loop: false,};

        this.Sfx_Boss_Laser = this.sound.add("Sfx_Boss_Laser"); //Boss laser sfx
        this.Boss_Laser_Config = {mute: false, volume: 0.5, loop: false,};

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
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //Flags
        this.GameOver = false;
        this.restartPrompted = false;
        this.reachedMidway = false;
        this.ApproachingTop = false;
        this.PlayingRoar = false;
        this.FinishedRoar = false;
        this.EnteringBoss = false;
        this.EnteredBoss = false;
        this.EnteringPhase2 = false;
        this.EnteredPhase2 = false;
        this.DyingBoss = false;
        this.BossDied = false;
        
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
        let textConfig = {
            fontFamily: 'Courier',
            backgroundColor: '#F6DF7A',
            fontSize: '28px',
            color: '#000000',
            align: 'center',
            padding: {
            top: 10,
            bottom: 10,
            },
        }
        this.Text_Stats = this.add.text(
            this.Text_Box.x,
            this.Text_Box.y, 
            "Score: " + this.Score, 
            textConfig
        ).setDepth(50).setOrigin(0.5, 0);

        //Restart prompt
        this.Text_Restart = this.add.text(
            game.config.width/2,
            game.config.height/2,
            "", 
            textConfig
        ).setDepth(50).setOrigin(0.5, 0.5);

        //Boss health bars
        this.Boss_Health_Core = this.add.rectangle(game.config.width/2, -20, 
            200, 
            5, 
            0xff225).setDepth(42).setOrigin(0.5, 0.5);
        this.Boss_Health_Left = this.add.rectangle(game.config.width/2, -20, 
            200, 
            5, 
            0xff225).setDepth(42).setOrigin(0.5, 0.5);
        this.Boss_Health_Right = this.add.rectangle(game.config.width/2, -20, 
            200, 
            5, 
            0xff225).setDepth(42).setOrigin(0.5, 0.5);

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
                        if(Monster.class == 'Boss_Claw') {
                            Temp.BossCore.destroyClaw(Monster.isLeft);
                            if(Monster.isLeft) {
                                Temp.BossLeft = null;
                            } else {
                                Temp.BossRight = null;
                            }
                        } 
                        if(Monster.class == 'Boss_Head') { //Play special boss death sequence when boss is defeated.
                            Temp.BossDeath();
                            Temp.DyingBoss = true;
                            Temp.Monsters.remove(Monster, false, false); //Removing monster
                        } else {
                            Temp.Monsters.remove(Monster, true, true); //Removing monster
                        }
                    
                    } else {
                        Temp.makeExplosion(Projectile, 0.2, 500); //Explosion animation
                        if(Monster.class == 'Boss_Head' &&
                           (!Temp.BossCore.leftDefeated || !Temp.BossCore.rightDefeated)) {
                            Monster.health += Projectile.damage;
                        }
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
        // General runtime
        //======================================================================
        //Updating player (Spaceship)
        this.Player.update();

        //Updating text
        this.Text_Stats.setText("Score: " + this.Score + "  " + //Score
            "Ship Health: " + this.Player.Health + "  " +            //Health
            "Ship Rank: " + this.Player.Level)                       //Ship Tier

        //Updating Boss health bars
        if(this.BossCore) {
            this.Boss_Health_Core.x = this.BossCore.x;
            this.Boss_Health_Core.y = this.BossCore.y + 100;
            this.Boss_Health_Core.width = 200 * (this.BossCore.health / this.BossCore.maxHealth);
        } else {
            this.Boss_Health_Core.x = -100;
            this.Boss_Health_Core.y = -100;
        }
        if(this.BossLeft) {
            this.Boss_Health_Left.x = this.BossLeft.x;
            this.Boss_Health_Left.y = this.BossLeft.y + 100;
            this.Boss_Health_Left.width = 200 * (this.BossLeft.health / this.BossLeft.maxHealth);
        } else {
            this.Boss_Health_Left.x = -100;
            this.Boss_Health_Left.y = -100;
        }
        if(this.BossRight) {
            this.Boss_Health_Right.x = this.BossRight.x;
            this.Boss_Health_Right.y = this.BossRight.y + 100;
            this.Boss_Health_Right.width = 200 * (this.BossRight.health / this.BossRight.maxHealth);
        } else {
            this.Boss_Health_Right.x = -100;
            this.Boss_Health_Right.y = -100;
        }
        

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

        //Reset behavior
        if (Phaser.Input.Keyboard.JustDown(keySpace) &&
            this.GameOver &&
            this.restartPrompted) 
        {
            this.Music_Menu.stop();
            this.BossCore = null;
            this.BossLeft = null;
            this.BossRight = null;
            this.scene.start('Scene_MainMenu'); 
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

        //======================================================================
        // Flag checks
        //======================================================================
        if(this.ApproachingTop && //Approaching boss zone
            !this.PlayingRoar) {
            this.PlayingRoar = true;

            this.Sfx_Boss_Intro.play(this.Intro_Config); //Playing boss intro roar
            this.tweens.add({ //Fading away music
                targets: this.Music_Stage1,
                volume: 0,
                duration: 1000
            });
            setTimeout(() => {
                this.FinishedRoar = true;
            }, 8000);
        }

        if(this.FinishedRoar && //Boss spawns in then enters the arena.
            !this.EnteringBoss) {
            this.EnteringBoss = true;
                this.spawnBoss();
        }

        if(this.BossCore && //Boss is entering phase 2
            this.BossCore.leftDefeated &&
            this.BossCore.rightDefeated &&
            !this.EnteringPhase2) 
        {
            this.EnteringPhase2 = true;
            this.EnterPhase2();
        }

        if(this.Player.Health < 1 && //Game Over lose
            !this.BossDied &&
            !this.GameOver) {
            this.GameOver = true;

            //Clearing monsters
            this.Monsters.clear(true, true);
            this.MonsterProjectiles.clear(true, true);
            
            //Fading music
            this.tweens.add({ //Fading away music
                targets: this.Music_Boss1,
                volume: 0,
                duration: 1000
            });
            this.tweens.add({ //Fading away music
                targets: this.Music_Boss2,
                volume: 0,
                duration: 1000
            });
            this.tweens.add({ //Fading away music
                targets: this.Music_Stage1,
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
                                    this.promptRestart(false);
                                }, 4000);
                            }, 100);
                        }, 1000);
                    }, 500);
                }, 500);
            }, 500);
        }

        //Game over win check
        if(this.BossDied &&
            !this.GameOver)
        {
            this.GameOver = true;
            this.promptRestart(true);
        }

    }

    //Spawn behaviors
    spawnWave() { //Summons a wave of monsters that go from one side of the screen to the other.
        //General data
        var monsterData = {};
        monsterData.data = {};
        monsterData.spawnX = 0;
        monsterData.spawnY = Math.floor(Math.random() * (game.config.height / 4)) + 150;
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
        monsterData.data.stopY = (game.config.height / 8) + 100;

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
        //Creating sprites
        this.BossCore = new Boss_Head( //head
            this, game.config.width/2, -500, 'Stage1_Boss-Head', 1,
            this.Player,
            this.MonsterProjectiles,
            this.Sfx_Boss_Roar,
            this.Roar_Config,
            this.Sfx_Boss_Laser,
            this.Boss_Laser_Config
        ).setDepth(40).setOrigin(0.5, 0.5).setScale(0.9)        
        this.BossLeft = new Boss_Claw( //left claw
            this, this.BossCore.x + 500, this.BossCore.y + 100, 'Stage1_Boss-Claw', 0,
            this.Player,
            this.MonsterProjectiles,
            this.BossCore,
            true
        ).setDepth(41).setOrigin(0.5, 0.5) 
        this.BossRight = new Boss_Claw( //right claw
            this, this.BossCore.x - 500, this.BossCore.y + 100, 'Stage1_Boss-Claw', 0,
            this.Player,
            this.MonsterProjectiles,
            this.BossCore,
            false
        ).setDepth(41).setOrigin(0.5, 0.5)

        //Moving boss into vision
        this.tweens.add({
            targets: this.BossCore,
            y: game.config.height/3,
            duration: 4000
        });
        this.tweens.add({
            targets: this.BossLeft,
            y: game.config.height/3 + 100,
            duration: 4000
        });
        this.tweens.add({
            targets: this.BossRight,
            y: game.config.height/3 + 100,
            duration: 4000
        });
        setTimeout(() =>{
            //roar
            this.BossCore.setFrame(7);
            this.Sfx_Boss_Roar.play(this.Roar_Config);
            
            //begin fight in 8s
            setTimeout(() =>{
                this.Music_Boss1.play(this.Boss1_Config);
                this.Monsters.add(this.BossCore);
                this.Monsters.add(this.BossLeft);
                this.Monsters.add(this.BossRight);
                this.EnteredBoss = true;
            }, 4000);
        }, 5000);
    }

    EnterPhase2() {
        //Temporarily removing boss from the update queue.
        this.Monsters.clear(false, false);
        this.BossCore.setFrame(14);
        this.tweens.add({ //Fading away Boss2
            targets: this.Music_Boss1,
            volume: 0,
            duration: 2000
        });
        setTimeout(() =>{
            this.BossCore.setFrame(15);
            this.Sfx_Boss_Roar.play(this.Roar_Config);
            setTimeout(() =>{
                this.Music_Boss2.play(this.Boss2_Config);
                this.Monsters.add(this.BossCore);
                this.EnteredPhase2 = true;
            }, 2500);
        }, 2500);
    }

    BossDeath() {//Sets up the first frame, fades the music, empty projectiles
        this.MonsterProjectiles.clear(true, true);
        this.BossCore.setFrame(14);
        this.tweens.add({
            targets: this.Music_Boss2,
            volume: 0,
            duration: 1500
        });
        setTimeout(() =>{
            this.BossDeath2(0, 20);
        }, 2000);
    }

    BossDeath2(count, max) { //Recursive explosions, increasing spd
        if(count < max) {
            let randomX = (Math.floor(Math.random() * this.BossCore.hitbox_width + 50)) - this.BossCore.hitbox_width/2;
            let randomY = (Math.floor(Math.random() * this.BossCore.hitbox_height + 50)) - this.BossCore.hitbox_height/2;
            
            this.Sfx_Explosion.play(this.Explosion_Config);
            let boom = this.add.sprite(
                this.BossCore.x - 50 + randomX, 
                this.BossCore.y - 50 + randomY, 
                "Explosion"
            ).setOrigin(0.5, 0.5).setScale(0.2).setDepth(100);
            this.tweens.add({targets: boom, alpha: 0, duration: 500});
            setTimeout(() => {boom.destroy();}, 500);
            setTimeout(() => {
                this.BossDeath2(count + 1, max);
            }, 500/(count + 1));
            
        } else {
            setTimeout(() =>{
                this.BossDeath3();
            }, 500);
        }
    }

    BossDeath3() { //One big explosion + one final roar before fading away
        this.makeExplosion(this.BossCore, 1.5, 4000);
        this.Sfx_Boss_Roar.play(this.Roar_Config);
        this.BossCore.setFrame(15);
        this.tweens.add({
            targets: this.BossCore, 
            alpha: 0, 
            duration: 4000
        });
        setTimeout(() =>{
            this.BossDied = true;
            this.Player.Health = 0;
            this.Music_Menu.play(this.Menu_Config);
            this.promptRestart(false);
        }, 4500);
    }


    //Makes an explosion
    makeExplosion(Target, scale, duration) {
        this.Sfx_Explosion.play(this.Explosion_Config);
        let boom = this.add.sprite(Target.x, Target.y, "Explosion").setOrigin(0.5, 0.5).setScale(scale).setDepth(100);
        this.tweens.add({targets: boom, alpha: 0, duration: duration});
        setTimeout(() => {boom.destroy();}, duration);
    }

    promptRestart(playerWon){
        if(playerWon) {
            this.Text_Restart.setText("Final score: " + this.Score + "\n" +
            "Excellent work! The spooky alien is no more!\n" +
            "Press SPACE to return to menu.")
        } else {
            this.Text_Restart.setText("Final score: " + this.Score + "\n" +
                "Go again. You can't give up now!\n" +
                "Press SPACE to return to menu.")
        }
        setTimeout(() => {this.restartPrompted = true;}, 2000);
    }
}