// Spaceship[Player] Prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame); // Something
        
        //Movement directions
        this.XDirection = 0;
        this.YDirection = 0;

        //Keydown before keyup checks
        this.WPressed = false;
        this.APressed = false;
        this.SPressed = false;
        this.DPressed = false;
        this.SpacePressed = false;

        //Ship rank
        this.Level = 1;
        this.MOVEMENT_SPEED = 5;

        //Adding object to scene.
        scene.add.existing(this);
    }

    update() {
        //Updating sprite location
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
        if (Phaser.Input.Keyboard.JustDown(keySpace)) {
            console.log("Space pressed");
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

}