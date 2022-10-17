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
        this.menuWindowContextX = this.cameras.main.centerX;
        this.menuWindowContextY = this.cameras.main.centerY + 50;
        this.load.image("logo", "images/newlogo.png");
        this.load.image("terminal", "images/terminal2.png");
        this.load.audio("hdd", "sounds/hdd_sound.ogg");
        this.load.audio("modem", "sounds/modem.ogg");
        this.load.image('xbillabout', 'images/xbill-about.png');
        this.load.image('abouticon', 'images/about.svg');
        this.load.image('rulesicon', 'images/rules.svg');
        this.load.image('vimicon', 'images/vimlogo.svg');
        this.load.image('clipicon', 'images/clip.png');
        this.load.image('tile', 'images/tile.png');
        this.load.image('minimize', 'images/minimize.png');
        this.load.image('close', 'images/close.png');
        // this.load.image('xwindowbox','images/xwindow.png');

    }

    create()
    {
        super.create();
        var div = document.getElementById('gameContainer');
        div.style.backgroundColor = "#505075"; // Window maker Default Style

        let myVolIcon = '';
        if (this.sound.mute) {
            myVolIcon = "volume-mute";
        } else {
            myVolIcon = "volume-unmute";
        }

        // Generate About and Rules windows here
        // TODO use pygtk to create real windows 
        // and get screenshots from it.
        this.aboutContainer = this.add.container(this.menuWindowContextX, this.menuWindowContextY);
        this.aboutContainer.setVisible(false);

        this.rulesContainer = this.add.container(this.menuWindowContextX, this.menuWindowContextY);
        this.rulesContainer.setVisible(false);

        /* Dock Icon Ops */
        const docks =
            [{text: 'Main', icon: 'clipicon'},
            {text: 'Volume', icon: myVolIcon},
            {text: 'Rules', icon: 'rulesicon'},
            {text: 'About', icon: 'abouticon'},
            {text: 'Vim', icon: 'vimicon'}];

        for (let i=0;i<docks.length;i++) {
            this.createDockButton(i, 0, docks[i]['icon'], docks[i]['text'], this);
        }

        /* End Dock Icon Ops */

        /* Game Menu Windows */
        let myWidth = this.game.renderer.width;
        let myHeight = this.game.renderer.height;

        let mainWindow = new wmaker(this);
        mainWindow.createXWindow(myWidth / 4, myHeight / 3, 440, 200, 'Terminal');

        const textStyle = { fontFamily: "Menlo Regular", fill: "#4af626", align: "left", fontSize: "26px", fixedWidth: 370, backgroundColor: '#fff' };
        let startButton = this.add.text(10, 30, 'bash-3.14 ~# ', textStyle)
            .setOrigin(0)
            .setPadding(10)
            .setDepth(1)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.stop('gameMenu'); 
                this.sound.removeAll();
                this.scene.start('webBill');})
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#4af626' }));

        // WARNING tWindow.windowContainer only contains the last create container!
        mainWindow.windowContainer.add(startButton);
        mainWindow.createXWindow(myWidth / 6, myHeight / 2, 500, 100, 'XLogo');

        // Need to pass this to functions and whatnot
        let myContext = this;
        let gameLogo = this.add.image(250, 75, 'logo')
            .setDepth(1);
        // TODO move these into a billSprite class
        let bill1 = this.add.sprite(0, 0, 'billL0').play('billLAnim');
        let bill2 = this.add.sprite(0, 0, 'billR0').play('billRAnim');
        let win1 = this.add.image(0, -20, 'wingdows');
        let win2 = this.add.image(0, -20, 'wingdows');
        /*
        let container1 = this.add.container((myWidth / 2 ) - 200, myHeight * 0.2, [win1, bill1]);
        let container2 = this.add.container((myWidth / 2 ) + 200, myHeight * 0.2, [win2, bill2]);
        */

        let container1 = this.add.container(40, 75, [win1, bill1]);
        let container2 = this.add.container(460, 75, [win2, bill2]);
        mainWindow.windowContainer.add([container1, gameLogo, container2]);


        /* End Game Menu Windows */


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

    dockCalls(dock)
    {
        console.log(dock);
        dockType = dock.data.get('type');
        console.log(dockType);
        switch(dockType) {
            case 'Vim':
                this.showPoweredByVim();
                break;
            case 'Rules':
                this.showRules();
                break;
            case 'Volume':
                this.muteSound();
                break;
            case 'About':
                this.showAbout();
                break;
            default:
                return;
        }
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
        this.rulesContainer.setVisible(!this.rulesContainer.visible);
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
        this.aboutContainer.setVisible(!this.aboutContainer.visible);
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

/*
 * vrow => int, vertical row
 * hrow => int, horizontal row
 * icon => string, previously loaded image 
 * dockText => string, docker text to place under icon
 * callback => function, function to call on click
 */
    createDockButton(vrow, hrow, icon, dockText)
    {
        let dockBoxHeight = 64;
        let dockBoxWidth = 64;
        let shadowLineThickness = 3;
        let dockMainLineWidth = dockBoxWidth - shadowLineThickness;
        let dockMainLineHeight = dockBoxHeight - shadowLineThickness;
        let shadowLineAlpha = 0.5;
        let dockColour1 = 0xa6a6b6;
        let dockColour2 = 0x515561;
        let shadowWhite = 0xffffff;
        let shadowGrey = 0x333637;
        let shadowBlack = 0x000000;
        let iconPadding = 20;

        const iconBoxStyle = { fontFamily: "Menlo Regular", fontSize: 10, fill: "#000"};
        let alpha = 0.5 + ((0 / 10) * 0.5);
        // For simplicity let's have single line of column regardless
        hrow = 0;
        //let myContainer = this.add.container(1, 1)
        let myContainer = this.add.container((dockBoxWidth * hrow), dockBoxHeight * vrow)
            .setDataEnabled()
            .setSize(dockBoxWidth, dockBoxHeight)
            .setDepth(4);

        let myDockBox = this.add.graphics()
             .setDepth(1);

        let myTile = this.add.image(0, 0, 'tile')
            .setOrigin(0)
            .setDisplaySize(dockBoxWidth, dockBoxHeight);
        myContainer.add(myTile);
        /*
        myDockBox.fillGradientStyle(dockColour1, dockColour2, dockColour2, dockColour2, 1);
        myDockBox.fillRect(0, 0, dockBoxWidth, dockBoxHeight);
        */
        myContainer.add(myDockBox);

        console.log('Adding: ' + dockText);

        let iconX = dockBoxWidth - iconPadding;
        let iconY = dockBoxHeight - iconPadding;
        let myIcon = this.add.image(iconX / 1.5, iconY /1.5, icon)
            .setOrigin(0.5, 0.5)
            .setSize(iconX, iconY)
            .setDisplaySize(iconX, iconY);

        // muteSound() needs to access this global
        if (dockText == 'Volume') {
            this.volImg = myIcon;
        }
        myContainer.data.set('type', dockText);
        myContainer.add(myIcon);

        if (dockText == 'Main') {
            let myText = this.add.text(20, dockBoxHeight - 15, dockText, iconBoxStyle)
                .setDepth(4);
            myContainer.add(myText);
            myText = this.add.text(15, 5, '1', iconBoxStyle)
                .setDepth(4);
            myContainer.add(myText);

            let myLine = new Phaser.Geom.Line(0, dockBoxHeight - 24, 24, dockBoxHeight);
            myDockBox.lineStyle(2, shadowBlack, shadowLineAlpha)
                .strokeLineShape(myLine);

            myLine = new Phaser.Geom.Line(dockBoxWidth - 24, 0, dockBoxWidth - 1, 24);
            myDockBox.strokeLineShape(myLine);

            let myTriangles = this.add.graphics().fillStyle(shadowBlack);
            myTriangles.fillTriangle(4, dockBoxHeight - 16, 4, dockBoxHeight - 6, 16 , dockBoxHeight - 6);
            myTriangles.fillTriangle(dockBoxWidth - 16,  4, dockBoxWidth - 6, 4, dockBoxWidth - 6, 16);
            myContainer.add(myTriangles);
        }
        myContainer.setInteractive()
           .on('pointerdown', this.dockCalls, this);
    }

    showPoweredByVim()
    {
        console.log('alo');
    }
}
