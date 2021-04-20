//Player Object (Spaceship)
class Player extends Phaser.GameObjects.Sprite {
    constructor() {
        //Movement directions
        this.XDirection = 0;
        this.YDirection = 0;

        //State checks
        
        //Keydown before keyup checks
        this.WPressed = false;
        this.APressed = false;
        this.SPressed = false;
        this.DPressed = false;
        this.SpacePressed = false;
    }

    update() {
        //Updating movement direction
        if (Phaser.Input.Keyboard.JustDown() && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        }
        //Update if still firing


        //Applying movement direction
        

    }

}