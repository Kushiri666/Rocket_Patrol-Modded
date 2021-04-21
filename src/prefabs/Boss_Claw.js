// Boss_claw prefab
class Boss_Claw extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, player, projectileStorage, headHost, isLeft) {
        super(scene, x, y, texture, frame);

        //Mandatory fields
        this.class = 'Boss_Claw';
        this.hitbox_width = 95;
        this.hitbox_height = 40;
        this.maxHealth = 300;
        this.health = 300;
        this.score = 500;
        
        //General fields
        this.action_Cooldown = true; //stops moving if true
        this.player = player; //Player reference
        this.scene = scene; //Scene reference
        this.storage = projectileStorage;
        
        //Unique fields
        this.host = headHost;
        this.isLeft = isLeft;
        this.offsetX;
        this.offsetY = 100;
        this.initial_Cooldown = true;
        this.action_Cooldown = false;
        
        this.fireRate = 500;
        this.fireballEnabled = false;
        this.fireball_Cooldown = false;

        //Enacting left/right hand distinctions
        if(this.isLeft) {
            this.flipX = true;
            this.offsetX = 500
        } else {
            this.offsetX = -500;
        }

        //Adding object to scene.
        scene.add.existing(this); 
    }

    update() {

        if(!this.action_Cooldown &&
             this.health > 0) 
        {
            this.action_Cooldown = true;
            this.action1();
        }
        
        //Fireballs
        if(this.fireballEnabled &&
            !this.fireball_Cooldown) 
        {
            this.fireball_Cooldown = true;
            this.storage.add(
                new Fireball(
                    this.scene, this.x, this.y, 'Stage1_Fireball', 0,
                    3,
                    'fall',
                    this.player
                ).setDepth(41).setScale(0.1).play('Fireball_Loop')
            )
            setTimeout(() => {
                this.fireball_Cooldown = false;
            }, this.fireRate);
        }
    }
    
    //Moving from 1 side of the screen to the other, dropping fireballs along the way.
    action1() {
        let Startpos;
        let Endpos;
        if(this.isLeft) {
            Startpos = 100;
            Endpos = game.config.width - 100;
        } else {
            Startpos = game.config.width - 100;
            Endpos = 100;
        }
        this.fireballEnabled = true; //fire away
        this.scene.tweens.add({ //moving to start
            targets: this,
            x: Startpos,
            duration: 200
        });

        setTimeout(() => {
            this.scene.tweens.add({ //moving to end
                targets: this,
                x: Endpos,
                duration: 2000
            });
            setTimeout(() => {
                this.fireballEnabled = false; //fire no more
                this.scene.tweens.add({ //returning to original position.
                    targets: this,
                    x: this.host.x + this.offsetX,
                    y: this.host.y + this.offsetY,
                    duration: 200
                });
                setTimeout(() => {
                    this.action_Cooldown = false;
                }, 5000);
            }, 2000);
        }, 200);
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