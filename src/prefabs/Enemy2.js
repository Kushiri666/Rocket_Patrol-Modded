// Enemy2 prefab
class Enemy2 extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, player, projectileStorage, direction) {
        super(scene, x, y, texture, frame);

        //Mandatory fields
        this.class = 'Enemy2';
        this.hitbox_width = 95;
        this.hitbox_height = 98;
        this.health = 8;
        this.score = 8;
        
        //General fields
        this.action_Cooldown = true; //stops moving if true
        this.player = player; //Player reference
        this.scene = scene; //Scene reference
        this.storage = projectileStorage;
        
        //Unique fields
        this.Xdirection = direction;
        this.Ydirection = -direction;
        this.maxMoves = 5;
        this.moveCount = 0;
        this.entered = false;
        this.action_Cooldown = true;
        this.fireball_Cooldown = true;

        //Adding object to scene.
        scene.add.existing(this); 
    }

    update() {
        //Initial entrance
        if(!this.entered) {
            this.entered = true;
            this.scene.tweens.add({ //Moving
                targets: this,
                x: game.config.width/2,
                y: game.config.height/6,
                duration: 500
            });
            setTimeout(() => {
                this.action_Cooldown = false;
            }, 1000);
        }

        //Tweening away abruptly then shooting a fireball.
        if(!this.action_Cooldown &&
            this.entered &&
            this.moveCount < this.maxMoves) {
            this.action_Cooldown = true;
            //Moving enemy
            let RandomX = (Math.floor(Math.random() * game.config.width / 4) + (game.config.width / 8)) * this.Xdirection;
            let predictionX = this.x + RandomX;
            if(predictionX > game.config.width - 50 ||
                predictionX < 50) {
                this.Xdirection *= -1;
                RandomX *= -1;
            }

            let RandomY = (Math.floor(Math.random() * game.config.height / 16) + (game.config.height / 32)) * this.Ydirection;
            let predictionY = this.y + RandomY;
            if(predictionY > game.config.height / 8 ||
                predictionY < 50) {
                this.Ydirection *= -1;
                RandomY *= -1;
            }

            this.scene.tweens.add({ //Moving
                targets: this,
                x: this.x + RandomX,
                y: this.y + RandomY,
                duration: 500
            });
            this.moveCount++;
            
            //enabling fireball
            setTimeout(() => {
                this.fireball_Cooldown = false;
            }, 750);

        } else if(!this.action_Cooldown &&
            this.entered){
            this.action_Cooldown = true;
            this.scene.tweens.add({ //Moving out of bounds
                targets: this,
                x: game.config.width * 1.5,
                y: game.config.height * -1.5,
                duration: 500
            });
        }
        if(!this.fireball_Cooldown) {
            this.fireball_Cooldown = true;
            this.storage.add(
                new Fireball(
                    this.scene, this.x, this.y, 'Stage1_Fireball', 0,
                    3,
                    'fall',
                    this.player
                ).setDepth(14).setScale(0.1).play('Fireball_Loop')
            );
            setTimeout(() => {
                this.action_Cooldown = false;
            }, 1000);
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