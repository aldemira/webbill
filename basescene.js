/*
 WebBill 
Copyright (C) 2022  Aldemir Akpinar <aldemir.akpinar@gmail.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
        this.load.image("volume-unmute", "images/volume-high.png");
        this.load.image("volume-mute", "images/volume-muted.png");
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
