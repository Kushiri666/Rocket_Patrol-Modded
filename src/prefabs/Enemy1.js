// Enemy1 prefab
class Enemy1 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, behavior, speed, rate, player, projectileStorage, additionalInfo) {
        super(scene, x, y, texture, frame);

        //Mandatory fields
        this.class = 'Enemy1';
        this.hitbox_width = 51;
        this.hitbox_height = 51;

        //won't update without it
        console.log(rate);
        
        //General fields
        this.movement_Speed = speed;
        this.fire_Rate = rate;
        this.additionalData = additionalInfo;
        this.behavior = behavior; //how it'll move
        this.initial_Cooldown = true; //can't fire fireball before a certain amount of time has passed
        this.fireball_Cooldown = true; //can't fire fireball if true
        this.player = player; //Player reference
        this.scene = scene; //Scene reference
        this.storage = projectileStorage;

        //Rain specific fields
        this.reachedStop = false;
        this.isFalling = false;

        //Adding object to scene.
        scene.add.existing(this); 
    }

    update() {
        //Perform the designated movement behavior.
        if(this.behavior == "wave") {
            this.wave();
        }
        if(this.behavior == "rain") {
            this.rain();
        }

        //starting fireball cooldown
        if(this.initial_Cooldown &&
            this.behavior != 'rain') 
        {
            this.initial_Cooldown = false;
            setTimeout(() => {
                this.fireball_Cooldown = false;
            }, Math.floor(Math.random() * 20) * 120);
        }

        //Shooting fireballs
        if(!this.fireball_Cooldown &&
            this.x > 0 &&
            this.y > 0 &&
            this.x < game.config.width &&
            this.y < game.config.height) 
        {
            this.fireball_Cooldown = true;
            console.log("Shooting fireball");

            //creating fireball object
            this.storage.add(
                new Fireball(
                    this.scene, this.x, this.y, 'Stage1_Fireball', 0,
                    3,
                    this.additionalData.fireball_behavior,
                    this.player
                ).setDepth(14).setScale(0.1).play('Fireball_Loop')
            );

            setTimeout(() => {
                if(this.behavior != 'rain') {
                    this.fireball_Cooldown = false;
                }
            }, this.fire_Rate);
        }
    }

    //Moves the monster from 1 side to the other, but only once
    wave() {
        //Movement
        this.x += this.additionalData.direction * this.movement_Speed;
        this.y += this.additionalData.yDrift;

        //Direction faced
        if(this.additionalData.direction > 0) {
            this.flipX = true;
        }
    }

    rain() {
        //Movement
        if(this.y < this.additionalData.stopY) {
            this.y += this.movement_Speed;
        } else if (this.isFalling){
            this.y += this.additionalData.fallSpeed;
        } else if(!this.reachedStop) {
            this.reachedStop = true;
            setTimeout(() => {
                this.fireball_Cooldown = false;
                setTimeout(() => {
                    this.isFalling = true;
                }, 500);
            }, 500);
        }

        //Face the player
        if(this.x - this.player.x < 0) {
            this.flipX;
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