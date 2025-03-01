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

    preload()
    {
        // Load images with error handling
        const assets = [
            ['billL0', 'images/billL_0.png'],
            ['billL1', 'images/billL_1.png'],
            ['billL2', 'images/billL_2.png'],
            ['billR0', 'images/billR_0.png'],
            ['billR1', 'images/billR_1.png'],
            ['billR2', 'images/billR_2.png'],
            ['wingdows', 'images/wingdows.png'],
            ['volume-unmute', 'images/volume-high.png'],
            ['volume-mute', 'images/volume-muted.png']
        ];
        assets.forEach(([key, path]) => this.load.image(key, path));
        this.load.on('filecomplete', (key) => console.log(`Loaded: ${key}`));
        this.load.on('loaderror', (file) => console.error(`Failed to load: ${file.key}`));
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
export default baseScene;
