// Laser prefab
class Fireball extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, speed, varient, player) {
        super(scene, x, y, texture, frame);

        //Mandatory fields
        this.class = 'Fireball';
        this.hitbox_width = 16;
        this.hitbox_height = 16;

        //Movement speed
        this.movement_Speed = speed;
        this.varient = varient;

        //determing trajectory (towards player)
        this.moveX = this.x - player.x;
        this.moveY = this.y - player.y;

        //Adding object to scene.
        scene.add.existing(this);
    }

    update() {
        if(this.varient == 'target') {
            this.target();
        }
        if(this.varient == 'fall') {
            this.fall();
        }
    }

    target() {
        //Constantly moving in the predetermined direction.   
        this.x -= this.moveX / Math.pow(this.movement_Speed, 5);
        this.y -= this.moveY / Math.pow(this.movement_Speed, 5);
    }

    fall() {
        //Constantly falling down.
        this.y += this.movement_Speed
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