// Spaceship[Player] Prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, LaserSfx, LaserConfig, RocketSfx, RocketConfig) {
        super(scene, x, y, texture, frame); // Something
        
        //Mandatory fields
        this.class = 'Spaceship';
        this.hitbox_width = 60;
        this.hitbox_height = 60;

        //Movement directions
        this.XDirection = 0;
        this.YDirection = 0;

        //Keydown before keyup checks
        this.WPressed = false;
        this.APressed = false;
        this.SPressed = false;
        this.DPressed = false;
        this.SpacePressed = false;

        //Class fields
        this.Level = 1; //Ship rank
        this.Rocket_Cooldown = false; //Cooldown for rocket projectiles
        this.MOVEMENT_SPEED = 5; //Movement speed
        this.scene = scene; //scene reference
        this.Sfx_Laser = LaserSfx; //Sfx reference
        this.Laser_Config = LaserConfig; //Config reference
        this.Sfx_Rocket = RocketSfx; //Sfx reference
        this.Rocket_Config = RocketConfig; //Config reference
        
        //List of spawned Projectiles
        this.Projectiles = new Phaser.GameObjects.Group(scene);

        //Adding object to scene.
        scene.add.existing(this);
    }

    update() {
        //Updating Spaceship location
        if( this.XDirection > 0 &&
            this.x + this.XDirection < game.config.width - 50)
        {
            this.x += this.XDirection;
        } 
        else if(this.XDirection < 0 &&
            this.x + this.XDirection > 50)
        {
            this.x += this.XDirection;
        }

        //Updating movement direction (Keydown)
        if (Phaser.Input.Keyboard.JustDown(keyA)) {
            console.log("A Pressed");
            this.APressed = true;
            this.XDirection -= this.MOVEMENT_SPEED;
        }
        if (Phaser.Input.Keyboard.JustDown(keyD)) {
            console.log("D Pressed");
            this.DPressed = true;
            this.XDirection += this.MOVEMENT_SPEED;
        }
        //Updating movement direction (Keyup)
        if (Phaser.Input.Keyboard.JustUp(keyA) && this.APressed) {
            console.log("A released");
            this.XDirection += this.MOVEMENT_SPEED;
            this.APressed = false;
        }
        if (Phaser.Input.Keyboard.JustUp(keyD) && this.DPressed) {
            console.log("D released");
            this.XDirection -= this.MOVEMENT_SPEED;
            this.DPressed = false;
        }

        //Shooting behavior (Keyup + Keydown)
        if (Phaser.Input.Keyboard.JustUp(keySpace)) {
            console.log("Space released");
        }
        if (Phaser.Input.Keyboard.JustDown(keySpace)) { //Spawn Rocket
            console.log("Space pressed");
            //General laser shot
            this.createLaser(0, -60);
            
            if(this.Level > 1) { //2 Extra lasers at t2+
                this.createLaser(-20, -15);
                this.createLaser(20, -15);
            }

            if(this.Level > 2 && !this.Rocket_Cooldown) { //2 Rockets exclusive to t3
                this.Rocket_Cooldown = true;
                this.createRocket(40, -10);
                this.createRocket(-40, -10);
                setTimeout(() => {
                    this.Rocket_Cooldown = false;
                }, 1000);
            }
        }
        
        //Testing levelups
        if (Phaser.Input.Keyboard.JustDown(keyW)) {
            console.log("W Pressed");
            if(this.upgrade()) {
                console.log("Upgrade successful.");
            } else {
                console.log("Upgrade failed, level too high.");
            }
            console.log(this.Level);
        }
        if (Phaser.Input.Keyboard.JustDown(keyS)) {
            console.log("S Pressed");
            if(this.downgrade()) {
                console.log("Downgrade successful.");
            } else {
                console.log("Downgrade failed, level too low.");
            }
            console.log(this.Level);
        }
    }

    //Creates a rocket object and stores it inside the projectile group.
    createRocket(xOffset, yOffset) {
        this.Sfx_Rocket.play(this.Rocket_Config); //Play sound
        this.Projectiles.add( //Create rocket
            new Rocket(
                this.scene, this.x + xOffset, this.y + yOffset, "Rocket", 0
            ).setScale(0.2, 0.3).setDepth(10).play("Rocket_Loop")
        );
    }

    //Creates a laser object and stores it inside the projectile group.
    createLaser(xOffset, yOffset) {
        this.Sfx_Laser.play(this.Laser_Config); //Play sound
        this.Projectiles.add( //Create laser
            new Laser(
                this.scene, this.x + xOffset, this.y + yOffset, "Laser", 0
            ).setScale(0.5).setDepth(11 )
        );
    }

    upgrade() {
        if(this.Level > 2) {
            return false;
        } else {
            this.Level += 1;
            this.setFrame(this.Level - 1);
            return true;
        }
    }

    downgrade() {
        if(this.Level < 2) {
            return false;
        } else {
            this.Level--;
            this.setFrame(this.Level - 1);
            return true;
        }
    }

    checkCollision(obj2) {
        var Xdist = Math.abs(this.x - obj2.x);
        var Ydist = Math.abs(this.y - obj2.y);

        var Xtol = this.hitbox_width + obj2.hitbox_width;
        var Ytol = this.hitbox_height + obj2.hitbox_height;

        if(Xdist < Xtol &&
            Ydist < Ytol) {
            return true;
        } else {
            return false;
        }
    }

}