class baseScene extends Phaser.Scene
{
    constructor(myScene)
    {
        super(myScene);
    }

    preload()
    {
        this.load.image("billL0", "images/billL_0.png");
        this.load.image("billL1", "images/billL_1.png");
        this.load.image("billL2", "images/billL_2.png");
        this.load.image("billR0", "images/billR_0.png");
        this.load.image("billR1", "images/billR_1.png");
        this.load.image("billR2", "images/billR_2.png");
        this.load.image("wingdows", "images/wingdows.png");
    }

    create()
    {
        // Mute button
        // let soundButton = this.add.button(myWidth -10, 10-myHeight, 'sprites', this.toggleMute, this, 'sound-icon', 'sound-icon', 'sound-icon');
        // Create animations
        this.anims.create({
            key: 'billRAnim',
            frames: [
                { key: 'billR0', frame: 0},
                { key: 'billR1', frame: 1},
                { key: 'billR2', frame: 2}
            ],
            frameRate: 2,
            repeat: -1
        });

        this.anims.create({
            key: 'billLAnim',
            frames: [
                { key: 'billL0', frame: 0},
                { key: 'billL1', frame: 1},
                { key: 'billL2', frame: 2}
            ],
            frameRate: 6,
            repeat: -1
        });
    }

    update()
    {
    }

    toggleMute()
    {
        if (!this.game.sound.mute) {
            this.game.sound.mute = true;
            this.soundButton.tint = 16711680;
        } else {
            this.game.sound.mute = false;
            this.soundButton.tint = 16777215;
        }
    }
}
