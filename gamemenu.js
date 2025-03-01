/*
 WebBill
Copyright (C) 2025  Aldemir Akpinar <aldemir.akpinar@gmail.com>

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
import baseScene from './baseScene.js';
import wmaker from './wmaker.js';

class gameMenu extends baseScene
{
    constructor()
    {
        super('gameMenu');
        this.volImg = '';
        this.mainContainer = '';
        this.volContainer = '';
        this.rulesContainer = '';
        this.aboutContainer = '';
        this.termContainer = '';
        this.logoContainer = '';
        this.vimContainer = '';
        this.terminalWindow = new Object();
        this.aboutWindow = new Object();
        this.rulesWindow = new Object();
        this.logoWindow = new Object();
        this.vimWindow = new Object();
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
        this.load.image('terminalicon', 'images/TerminalGNUstep.png');
        this.load.image('xlogo', 'images/xorg-logo.svg');

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

        let myWidth = this.game.renderer.width;
        let myHeight = this.game.renderer.height;

        // Create a fake window maker
        let mainWindow = new wmaker(this);

        /* Dock Icon Ops */
        /* I hate JS!!!
        // I tried to loop and create a msp but when I attach
        // newly created container to the object for some reason
        // the somtimes wrong functions are fired. It musn't be my mistake is it?
        // Maybe it is :(
        */

        // args -> row, col, icon, text, context
        this.mainContainer = mainWindow.createDockButton(0, 0, 'clipicon', 'Main', this);
        this.volContainer = mainWindow.createDockButton(1, 0, myVolIcon, 'Volume', this);
        this.rulesContainer = mainWindow.createDockButton(2, 0, 'rulesicon', 'Rules', this);
        this.aboutContainer = mainWindow.createDockButton(3, 0, 'abouticon', 'About', this);
        this.termContainer = mainWindow.createDockButton(4, 0, 'terminalicon', 'Terminal', this);
        this.logoContainer = mainWindow.createDockButton(5, 0, 'xlogo', 'Xlogo', this);
        this.vimContainer = mainWindow.createDockButton(6, 0, 'vimicon', 'Vim', this);

        // Add mouse click to the first element of the container, otherwise click boundaries aren't setup correctly.
        this.mainContainer.list[0].on('pointerdown', this.mainWindowAction);
        this.volContainer.list[0].on('pointerdown', this.muteSound);
        this.rulesContainer.list[0].on('pointerdown', () => { this.rulesWindow.setVisible(true); });
        this.aboutContainer.list[0].on('pointerdown', () => { this.aboutWindow.setVisible(true); });
        this.termContainer.list[0].on('pointerdown', () => { this.terminalWindow.setVisible(true); });
        this.logoContainer.list[0].on('pointerdown', () => { this.logoWindow.setVisible(true); });
        this.vimContainer.list[0].on('pointerdown', () => { this.vimWindow.setVisible(true); });

        /* End Dock Icon Ops */

        /* Game Menu Windows */
        this.terminalWindow = mainWindow.createXWindow(
            myWidth / 4, myHeight / 3, 440, 200, 'Terminal');

        let textStyle = { fontFamily: "Menlo Regular", fill: "#4af626", align: "left", fontSize: "26px", backgroundColor: '#fff' };
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

        this.terminalWindow.add(startButton);
        this.logoWindow = mainWindow.createXWindow(
            myWidth / 6, myHeight / 2, 500, 100, 'XLogo');

        // Need to pass this to functions and whatnot
        let myContext = this;
        let gameLogo = this.add.image(250, 75, 'logo')
            .setDepth(1);
        // TODO move these into a billSprite class
        let bill1 = this.add.sprite(0, 0, 'billL0').play('billLAnim');
        let bill2 = this.add.sprite(0, 0, 'billR0').play('billRAnim');
        let win1 = this.add.image(0, -20, 'wingdows');
        let win2 = this.add.image(0, -20, 'wingdows');

        let container1 = this.add.container(40, 75, [win1, bill1]);
        let container2 = this.add.container(460, 75, [win2, bill2]);
        this.logoWindow.add([container1, gameLogo, container2]);

        // Hidden -> true
        this.vimWindow = mainWindow.createXWindow(myWidth/3, myHeight / 6, 300, 150, 'Powered by Vim', true);
        //textStyle = { fontFamily: "Menlo Regular", fill: "#000", align: "left", fontSize: "14px", backgroundColor: '#fff' };
        textStyle['fill'] = '#000';
        textStyle['fontSize'] = '14px';
        let vimText = this.add.text(10, 30, "~ This game is written in Vim only\n~ \n~ \n~ \n~ \n~ \n~ \n~ ", textStyle)
            .setOrigin(0)
            .setDepth(1)
        this.vimWindow.add(vimText);

        let ruleText = "xBill has been painstakingly designed and\nresearched in order to make it as easy to use\nfor the whole family as it is for little Sally.\nYears - nay - days of beta testing and \nconsulting with the cheapest of human interface\ndesigners have resulted in a game that is easy\nto use, yet nothing at all like a Macintosh.\n\nI.   Whack the Bills (click)\nII.  Restart the computer (click)\nIII. Pick up stolen OSes & return(drag)\nthem to their respective computers\nIV.  Drag the bucket to extinguish sparks\nV.   Scoring is based on total uptime,\nwith bonuses for killing Bills.\n\nAs for the rest, you can probably figure\nit out.  We did, so it can't be too hard.";
        // Hidden -> true
        this.rulesWindow = mainWindow.createXWindow(myWidth/2, myHeight / 6, 430, 375, 'Rules', true);
        let ruleText2Add = this.add.text(10,30, ruleText, textStyle)
            .setOrigin(0)
            .setDepth(1);
        this.rulesWindow.add(ruleText2Add);

        this.aboutWindow = mainWindow.createXWindow(myWidth/3, myHeight / 5, 400, 350, 'About', true);
        let aboutText = this.add.text(10, 30, 'More popular than Quake!\nOriginal concept designed and', textStyle)
            .setOrigin(0)
            .setDepth(1);

        let aboutlogo = this.add.image(200, 150, 'xbillabout')
            .setDepth(2);

        let aboutText2 = this.add.text(10, 175, 'Written by Aldemir Akpinar.')
            .setOrigin(0)
            .setDepth(1);

        this.aboutWindow.add([aboutText, aboutlogo, aboutText2]);
        /* End Game Menu Windows */



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

    mainWindowAction()
    {
        console.log('Main window');
        // Maybe, flash the screen with a disappearing 1
        return;
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

    muteSound()
    {
        this.game.sound.mute = !this.game.sound.mute;
        this.volContainer.getAt(2).setTexture(this.game.sound.mute ? 'volume-mute' : 'volume-unmute');
        // this.volImg.setTexture(myIcon);
        // 0 & 1 are graphics for shadows
    }
}

export default gameMenu;
