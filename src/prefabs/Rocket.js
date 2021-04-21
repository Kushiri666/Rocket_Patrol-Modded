// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //Mandatory fields
        this.class = 'Rocket';
        this.hitbox_width = 31;
        this.hitbox_height = 52;
        this.damage = 4;

        //Movement speed
        this.MOVEMENT_SPEED = 6;

        //Adding object to scene.
        scene.add.existing(this);
    }

    update() {
        //Constantly moving upwards.    
        this.y-= this.MOVEMENT_SPEED;
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