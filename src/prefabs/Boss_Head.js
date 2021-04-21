// Boss_Head prefab
class Boss_Head extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, headTexture, frame, player, projectileStorage, roar, roarConfig, laser, laserConfig) {
        super(scene, x, y, headTexture, frame);

        //Mandatory fields
        this.class = 'Boss_Head';
        this.hitbox_width = 140;
        this.hitbox_height = 80; //80 when mouth is closed
        this.maxHealth = 800;
        this.health = 800;
        this.score = 1000;
        
        //General fields
        this.player = player; //Player reference
        this.scene = scene; //Scene reference
        this.storage = projectileStorage;

        //Unique fields
        this.mouthIsOpen = false;
        this.Sfx_Roar = roar;
        this.Roar_Config = roarConfig;
        this.Sfx_Laser = laser;
        this.Laser_Config = laserConfig;
        this.fireRate = 3000;
        this.enraged = false;
        this.enragedBoon = 2; //Doubles the firerate if active (faster).

        this.leftDefeated = false;
        this.rightDefeated = false;

        this.isRoaring = false; //For managing painful roars.
        this.action_Cooldown = false; //For managing hand behaviors.

        //Adding object to scene.
        scene.add.existing(this); 
    }

    update() {
        //Always looking at player unless defeated
        if(this.health > 0 &&
            !this.isRoaring) {
            let frame;
            //Determining direction to look at
            let difference = this.x - this.player.x;
            if(difference > 100) {
                frame = 2;
            } else if(difference < -100) {
                frame = 3;
            } else {
                frame = 1;
            }
            //Applying open-mouth modifier
            if(this.mouthIsOpen) {frame += 7;}
            this.setFrame(frame);
        }
        
        //enraged trigger
        if(this.leftDefeated &&
            this.rightDefeated &&
            !this.enraged) 
        {
            this.enraged = true;
        }

        //Action selection
        if(!this.action_Cooldown &&
            this.health > 0) 
        {
            this.action_Cooldown = true;

            let Temp = Math.floor(Math.random() * 100);
            if(Temp > 80) {
                this.action1(); //3
            } else if(Temp > 50) {
                this.action1(); //2
            } else { 
                this.action1()
            }
        }
    }

    //Phase 1 Shoots a homing fireball towards the player.
    //Phase 2 Shoots 3 homing fireballs towards the player.
    action1() {
        var fireballData = {}
        fireballData.speed = 2,

        fireballData.data = {};
        fireballData.data.varient = 'track';
        fireballData.data.scale = 0.2;

        if(this.enraged) {
            this.shootFireball(0, 3, fireballData, 500, 2000);
        } else {
            this.shootFireball(0, 1, fireballData, 0, 10000);
        }
    }

    //Phase 1 Roars
    //Phase 2 Moves for 10 seconds while shooting fireballs downwards
    action2() {

    }

    //Phase 1 Summons fireballs from the sky for 5 seconds
    //Phase 2 Charges up a massive fireball barrage.
    action3() {
    
    }

    shootFireball(count, goal, data, repeatDelay, endDelay) { //for recursive calls
        if(count < goal) {
            if(this.health < 1) {return false;}

            this.mouthIsOpen = true;
            setTimeout(() => {this.mouthIsOpen = false}, 150);
            
            this.storage.add(
                new Fireball(this.scene, this.x, this.y + 80, "Stage1_Fireball", 0,
                    data.speed,
                    'boss',
                    this.player,
                    data.data
                ).setDepth(41).setOrigin(0.5, 0.5).setScale(0.2).play("Fireball_Loop")
            );
            setTimeout(() => {
                this.shootFireball(count + 1, goal, data, repeatDelay, endDelay);
            }, repeatDelay);
        } else {
            setTimeout(() => {
                this.action_Cooldown = false;
            }, endDelay);
        }
    }

    destroyClaw(isLeft) {
        this.isRoaring = true;
        this.setFrame(16);
        this.Sfx_Roar.play(this.Roar_Config);
        if(isLeft) {
            this.leftDefeated = true;
        } else {
            this.rightDefeated = true;
        }
        setTimeout(() =>{
            this.isRoaring = false;
        }, 3000);
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