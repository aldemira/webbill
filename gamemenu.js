/*
 WebBill
Copyright (C) 2021  Aldemir Akpinar <aldemir.akpinar@gmail.com>

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

class gameMenu extends baseScene
{
    constructor()
    {
        super('gameMenu');
        this.volImg = '';
    }

    preload()
    {
        super.preload();
        this.load.image("logo", "images/newlogo.png");
        this.load.image("terminal", "images/terminal2.png");
        this.load.audio("hdd", "sounds/hdd_sound.ogg");
        this.load.audio("modem", "sounds/modem.ogg");
        this.load.image('about', 'images/about.png');
    }

    create()
    {
        super.create();

        let alpha = 0.5 + ((0 / 10) * 0.5);
        let myIcon = '';
        if (this.sound.mute) {
            myIcon = "volume-mute";
        } else {
            myIcon = "volume-unmute";
        }


        // Start Dock Graphics
        let dockBox = this.add.graphics();
        dockBox.fillStyle(0x787878, 1)
            .setDepth(2)
            .fillRect(6, 6, 105, 140);
        // Left shadow
        var myLine = new Phaser.Geom.Line(8, 7, 8, 146);
        dockBox.lineStyle(1, 0xffffff, 0.5)
            .strokeLineShape(myLine);
        // top shadow
        myLine = new Phaser.Geom.Line(7, 7, 111, 7);
        dockBox.strokeLineShape(myLine);

        // right Shadow
        myLine = new Phaser.Geom.Line(111, 7, 111, 146);
        dockBox.lineStyle(1, 0x333637, 1)
            .strokeLineShape(myLine);

        // bottom shadow
        myLine = new Phaser.Geom.Line(7, 145, 111, 145);
        dockBox.strokeLineShape(myLine);

        let volIconBox = this.add.graphics();
        volIconBox.fillStyle(0x787878, alpha)
            .setDepth(3)
            .fillRect(10, 10, 48, 68)
            .setInteractive()
            .on('pointerdown', this.muteSound, this);

        this.volImg = this.add.image(36, 30, myIcon)
            .setDisplaySize(36, 36)
            .setInteractive()
            .setDepth(4)
            .on('pointerdown', this.muteSound, this);

        // Left & top white shadow
        myLine = new Phaser.Geom.Line(10, 10, 10, 68);
        volIconBox.lineStyle(2, 0xffffff, 0.5)
            .strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(10, 10, 56, 10);
        volIconBox.strokeLineShape(myLine);

        // Right and bottom black shadow
        myLine = new Phaser.Geom.Line(10, 68, 58, 68);
        volIconBox.lineStyle(2, 0x333637, 0.5)
            .strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(58, 10, 58, 68);
        volIconBox.strokeLineShape(myLine);

        const iconBoxStyle = { fontFamily: "Menlo Regular", fontSize: 10, fill: "#000"};
        this.add.text(15,55, 'Volume', iconBoxStyle).setDepth(4);

        // TODO make rect widths variable
        let rulesIconBox = this.add.graphics();
        rulesIconBox.fillStyle(0x787878, alpha)
            .setDepth(3)
            .fillRect(58,10, 48, 68);
        this.add.text(63,55, 'Rules', iconBoxStyle).setDepth(4);
        // Left & top white shadow
        myLine = new Phaser.Geom.Line(59, 10, 59, 68);
        rulesIconBox.lineStyle(2, 0xffffff, 0.5)
            .strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(59, 10, 59+46, 10);
        rulesIconBox.strokeLineShape(myLine);

        // Right and bottom black shadow
        myLine = new Phaser.Geom.Line(59+48, 10, 59+48, 68);
        rulesIconBox.lineStyle(2, 0x333637, 0.5)
            .strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(59, 68, 59+48, 68);
        rulesIconBox.strokeLineShape(myLine);

        let aboutIconBox = this.add.graphics();
        aboutIconBox.fillStyle(0x787878, alpha)
            .setDepth(3)
            .fillRect(10, 59+48, 10, 68);

        // End dock icons

        let myWidth = this.game.renderer.width;
        let myHeight = this.game.renderer.height;
        // Need to pass this to functions and whatnot
        let myContext = this;
        this.add.image(myWidth / 2, myHeight * 0.2, 'logo').setDepth(1);
        // TODO move these into a billSprite class
        let bill1 = this.add.sprite(0, 0, 'billL0').play('billLAnim');
        let bill2 = this.add.sprite(0, 0, 'billR0').play('billRAnim');
        let win1 = this.add.image(0, -20, 'wingdows');
        let win2 = this.add.image(0, -20, 'wingdows');
        let container1 = this.add.container((myWidth / 2 ) - 200, myHeight * 0.2, [win1, bill1]);
        let container2 = this.add.container((myWidth / 2 ) + 200, myHeight * 0.2, [win2, bill2]);
        this.add.image(myWidth / 2, myHeight / 2 + 50, 'terminal').setDepth(0);

        const textStyle = { fontFamily: "Menlo Regular", fill: "#4af626", align: "left", fontSize: "26px", fixedWidth: 370, backgroundColor: '#fff' };
        let startButton = this.add.text((myWidth / 2) - 40 , (myHeight / 2) - 50, 'bash-3.14 ~# ', textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.stop('gameMenu'); 
                this.sound.removeAll();
                this.scene.start('webBill');})
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#4af626' }));


        /*
        let rulesButton = this.add.text((myWidth / 2) - 40, (myHeight / 2) + 20, 'bash-3.14 ~# ', textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => rulesButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => rulesButton.setStyle({ fill: '#4af626' }));

        rulesButton.on('pointerdown', function() {
            let tempConsole = myContext.add.image(myWidth / 2, myHeight / 2 + 100, 'terminal').setDepth(3);
        });
        */

        let aboutButton = this.add.text((myWidth / 2) - 40, (myHeight / 2) + 90, 'bash-3.14 ~# ', textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1)
            .setInteractive({ useHandCursor: true})
            .on('pointerover', () => aboutButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => aboutButton.setStyle({ fill: '#4af626' }));

        let okButton = this.add.text((myWidth / 2) - 40, (myHeight / 2) + 150 , 'OK', textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1)
            .setStyle({border: 1, fontSize: 18})
            .setInteractive({ useHandCursor: true})
            .setVisible(false)
            .on('pointerover', () => aboutButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => aboutButton.setStyle({ fill: '#4af626' }));

        let aboutimg = myContext.add.image((myWidth / 2) - 40, (myHeight / 2) + 40, 'about').setDepth(5).setVisible(false);

        okButton.on('pointerdown', function() {
            this.setVisible(false);
            aboutimg.setVisible(false);
            startButton.setVisible(true);
            rulesButton.setVisible(true);
            aboutButton.setVisible(true);
        });

        aboutButton.on('pointerdown', function() {
            aboutimg.setVisible(true);
            okButton.setVisible(true);
            startButton.setVisible(false);
            rulesButton.setVisible(false);
            aboutButton.setVisible(false);
        });

        this.sound.play('hdd',{
            loop: true
        });

        var timer = this.time.addEvent({
            delay: Phaser.Math.Between(400,2500),
            callback: function() { this.sound.play('modem'); },
            args: [],
            callbackScope: this,
            loop: false
        });


        this.typewriteText('Start Game', startButton);
        // this.typewriteText('Rules', rulesButton);
        this.typewriteText('About', aboutButton);
    }

    update()
    {
    }

    typewriteText(text, obj)
    {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                obj.text = obj.text.slice(0, -1);
                // obj.text += text[i] + "\u{220e}";
                obj.text += text[i] + "_";
                ++i
            },
            repeat: length - 1,
            delay: 200
        })
    }

    blinkCursor(obj)
    {

        // Simple cursor blink action
        this.time.addEvent({
            callback: () => {
                if (obj.text.charAt(obj.text.length - 1) == '_' ) {
                    obj.text = obj.text.slice(0, -1);
                } else {
                    obj.text += '_';
                }
            },
            repeat: -1,
            delay: 700,
        });
    }

    showRules()
    {
        let ruleText = `
        xBill has been painstakingly designed and\n
researched in order to make it as easy to use\n
for the whole family as it is for little Sally.\n
Years - nay - days of beta testing and \n
consulting with the cheapest of human interface\n
designers have resulted in a game that is easy\n
to use, yet nothing at all like a Macintosh.\n
\n
I.   Whack the Bills (click)\n
II.  Restart the computer (click)\n
III. Pick up stolen OSes & return(drag)\n
     them to their respective computers\n
IV.  Drag the bucket to extinguish sparks\n
V.   Scoring is based on total uptime,\n
     with bonuses for killing Bills.\n
\n\
As for the rest, you can probably figure\n
it out.  We did, so it can't be too hard."
        `;

        console.log(this);
        //t.game.load.plugin('rexscaleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscaleplugin.min.js', true);
        //scene.plugins.get('rexscaleplugin').popup(ruleText, 0);
    }

    muteSound()
    {
        let myIcon = '';
        game.sound.mute = !game.sound.mute;
        if (game.sound.mute) {
            myIcon = "volume-mute";
        } else {
            myIcon = "volume-unmute";
        }
        this.volImg.setTexture(myIcon);
    }


    showAbout()
    {
    }
}
