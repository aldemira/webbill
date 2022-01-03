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
        this.terminalContainer = '';
        this.menuWindowContextX = this.game.renderer.width / 2;
        this.menuWindowContextY = (this.game.renderer.height / 2) + 50;
        this.dockBoxHeight = 60;
        this.dockBoxWidth = 50;
        this.dockMainBoxWOffset = 8;
        this.dockMainBoxHOffset = 20;
        this.dockMainWidth =  (this.dockBoxWidth * 2) + this.dockMainBoxWOffset + 1;
        this.dockMainHeight = (this.dockBoxHeight * 2) + this.dockMainBoxHOffset + 1;
        this.dockMainLineWidth = this.dockMainWidth - 1;
        this.dockMainLineHeight = this.dockMainHeight - 1;
        this.shadowLineThickness = 1;
        this.shadowLineAlpha = 0.5;
        this.shadowWhite = 0xffffff;
        this.shadowGrey = 0x333637;

        this.aboutContainer = this.add.container(this.menuWindowContextX, this.menuWindowContextY);
        this.aboutContainer.setVisible(false);

        this.rulesContainer = this.add.container(this.menuWindowContextX, this.menuWindowContextY);
        this.rulesContainer.setVisible(false);
    }

    preload()
    {
        super.preload();
        this.load.image("logo", "images/newlogo.png");
        this.load.image("terminal", "images/terminal2.png");
        this.load.audio("hdd", "sounds/hdd_sound.ogg");
        this.load.audio("modem", "sounds/modem.ogg");
        this.load.image('xbillabout', 'images/xbill-about.png');
        this.load.image('abouticon', 'images/about.svg');
        this.load.image('rulesicon', 'images/rules.svg');
        // this.load.image('xwindowbox','images/xwindow.png');
    }

    create()
    {
        super.create();

        let alpha = 0.5 + ((0 / 10) * 0.5);
        let myVolIcon = '';
        if (this.sound.mute) {
            myVolIcon = "volume-mute";
        } else {
            myVolIcon = "volume-unmute";
        }


        // Start Dock Graphics
        const iconBoxStyle = { fontFamily: "Menlo Regular", fontSize: 10, fill: "#000"};
        // Main dock background
        let dockBox = this.add.graphics();
        dockBox.fillStyle(0x333637, alpha)
            .fillRect(5, 5, this.dockMainWidth, this.dockMainHeight);

        let volIconBox = this.add.graphics();
        volIconBox.fillStyle(0x787878, alpha)
            .setDepth(3)
            .fillRect(10, 10, this.dockBoxWidth , this.dockBoxHeight)
            .setInteractive()
            .on('pointerdown', this.muteSound, this);

        let rulesIconBox = this.add.graphics();
        rulesIconBox.fillStyle(0x787878, alpha)
            .setDepth(3)
            .fillRect(11 + this.dockBoxWidth, 10, this.dockBoxWidth, this.dockBoxHeight);

        let aboutIconBox = this.add.graphics();
        aboutIconBox.fillStyle(0x787878, alpha)
            .setDepth(3)
            .fillRect(10, 11+this.dockBoxHeight, this.dockBoxWidth, this.dockBoxHeight);

        this.volImg = this.add.image(38, 31, myVolIcon)
            .setDisplaySize(36, 36)
            .setInteractive()
            .setDepth(4)
            .on('pointerdown', this.muteSound, this);

        this.aboutIcon = this.add.image(35, 31 + this.dockBoxHeight, 'abouticon')
            .setDisplaySize(36, 36)
            .setInteractive()
            .setDepth(4)
            .on('pointerdown', this.showAbout, this);

        this.rulesIcon = this.add.image(38 + this.dockBoxWidth, 31, 'rulesicon')
            .setDisplaySize(36, 36)
            .setInteractive()
            .setDepth(4)
            .on('pointerdown', this.showRules, this);


        this.add.text(17,55, 'Volume', iconBoxStyle).setDepth(4);
        this.add.text(17 + this.dockBoxWidth, 55, 'Rules', iconBoxStyle).setDepth(4);
        this.add.text(17,55 + this.dockBoxHeight, 'About', iconBoxStyle).setDepth(4);

        // MAIN dock box shadows
        // Left shadow
        var myLine = new Phaser.Geom.Line(6, 6, 6, 6 + this.dockMainLineHeight);
        dockBox.lineStyle(this.shadowLineThickness, this.shadowWhite, this.shadowLineAlpha)
            .strokeLineShape(myLine);
        // top shadow
        myLine = new Phaser.Geom.Line(6, 6, 6 + this.dockMainLineWidth, 6);
        dockBox.strokeLineShape(myLine);

        // right Shadow
        myLine = new Phaser.Geom.Line(6 + this.dockMainLineWidth, 6, 6 + this.dockMainLineWidth, 6 + this.dockMainLineHeight);
        dockBox.lineStyle(this.shadowLineThickness, this.shadowGrey, this.shadowLineAlpha)
            .strokeLineShape(myLine);

        // bottom shadow
        myLine = new Phaser.Geom.Line(5, 5 + this.dockMainLineHeight, 5 + this.dockMainLineWidth, 5 + this.dockMainLineHeight);
        dockBox.strokeLineShape(myLine);

        // VOLUME BOX SHADOWS
        // Left  white shadow
        myLine = new Phaser.Geom.Line(10, 10, 10, 10 + this.dockBoxHeight);
        volIconBox.lineStyle(this.shadowLineThickness, this.shadowWhite, this.shadowLineAlpha)
            .strokeLineShape(myLine);
        // Top shadow
        myLine = new Phaser.Geom.Line(10, 10, 10 + this.dockBoxWidth, 10);
        volIconBox.strokeLineShape(myLine);

        // Bottom black shadow
        myLine = new Phaser.Geom.Line(10, 10 + this.dockBoxHeight, 10 + this.dockBoxWidth, 10 + this.dockBoxHeight);
        volIconBox.lineStyle(this.shadowLineThickness, this.shadowGrey, this.shadowLineAlpha)
            .strokeLineShape(myLine);
        // Right shadow
        myLine = new Phaser.Geom.Line(10 + this.dockBoxWidth, 10, 10 + this.dockBoxWidth, 10 + this.dockBoxWidth);
        volIconBox.strokeLineShape(myLine);

        // Rules box shadows
        // Left  white shadow
        myLine = new Phaser.Geom.Line(11 + this.dockBoxWidth, 10, 11 + this.dockBoxWidth, 10 + this.dockBoxHeight);
        rulesIconBox.lineStyle(this.shadowLineThickness, this.shadowWhite, this.shadowLineAlpha)
            .strokeLineShape(myLine);
        // top white shadow
        myLine = new Phaser.Geom.Line(11 + this.dockBoxWidth, 10, 11 + (this.dockBoxWidth * 2), 10);
        rulesIconBox.strokeLineShape(myLine);

        // Right black shadow
        myLine = new Phaser.Geom.Line(11 + (this.dockBoxWidth * 2), 10, 11 + (this.dockBoxWidth * 2) , 10 + this.dockBoxHeight);
        rulesIconBox.lineStyle(this.shadowLineThickness, this.shadowGrey, this.shadowLineAlpha)
            .strokeLineShape(myLine);
        // bottom black shadow
        myLine = new Phaser.Geom.Line(11 + this.dockBoxWidth, 10 + this.dockBoxHeight, 11 + (this.dockBoxWidth * 2) , 10 + this.dockBoxHeight);
        rulesIconBox.strokeLineShape(myLine);

        // ABOUT BOX SHADOWS
        // Left  white shadow
        myLine = new Phaser.Geom.Line(10, 11 + this.dockBoxHeight, 10, 11 + (this.dockBoxHeight * 2));
        aboutIconBox.lineStyle(this.shadowLineThickness, this.shadowWhite, this.shadowLineAlpha)
            .strokeLineShape(myLine);
        // top white shadow
        myLine = new Phaser.Geom.Line(10, 11, 10 + this.dockBoxWidth, 11);
        aboutIconBox.strokeLineShape(myLine);

        // Right black shadow
        myLine = new Phaser.Geom.Line(10 + this.dockBoxWidth, 11 + this.dockBoxHeight, 10 + this.dockBoxWidth , 11 + (this.dockBoxHeight * 2));
        aboutIconBox.lineStyle(this.shadowLineThickness, this.shadowGrey, this.shadowLineAlpha)
            .strokeLineShape(myLine);
        // bottom black shadow
        myLine = new Phaser.Geom.Line(10, 10 + (this.dockBoxHeight*2), 10 + this.dockBoxWidth, 10 + (this.dockBoxHeight*2));
        aboutIconBox.strokeLineShape(myLine);

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

        let menuTerminal = this.add.image(0, 0, 'terminal').setDepth(0);

        const textStyle = { fontFamily: "Menlo Regular", fill: "#4af626", align: "left", fontSize: "26px", fixedWidth: 370, backgroundColor: '#fff' };
        let startButton = this.add.text(-40 , -100, 'bash-3.14 ~# ', textStyle)
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

        this.terminalContainer = this.add.container(this.menuWindowContextX, this.menuWindowContextY, [menuTerminal, startButton]);

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

        let aboutButton = this.add.text((myWidth / 2) - 40, (myHeight / 2) + 90, 'bash-3.14 ~# ', textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1)
            .setInteractive({ useHandCursor: true})
            .on('pointerover', () => aboutButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => aboutButton.setStyle({ fill: '#4af626' }));
        */

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

        /*
        aboutButton.on('pointerdown', function() {
            aboutimg.setVisible(true);
            okButton.setVisible(true);
            startButton.setVisible(false);
            rulesButton.setVisible(false);
            aboutButton.setVisible(false);
        });
        */

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
        this.terminalContainer.setVisible(!this.terminalContainer.visible);
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

    }

    showAbout()
    {
        this.terminalContainer.setVisible(!this.terminalContainer.visible);
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
}
