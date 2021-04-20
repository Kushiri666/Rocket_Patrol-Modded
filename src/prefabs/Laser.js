// Laser prefab
class Laser extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        //Movement speed
        this.MOVEMENT_SPEED = 12;
        
        //Adding object to scene.
        scene.add.existing(this);
    }

    update() {
        //Constantly moving upwards.    
        this.y-= this.MOVEMENT_SPEED;
    }

    //Deletes the object
    delete() {
        this.delete();
    }
}