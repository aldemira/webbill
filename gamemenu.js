class gameMenu extends baseScene
{
    constructor()
    {
        super('gameMenu');
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
        let myWidth = this.game.renderer.width;
        let myHeight = this.game.renderer.height;
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
            .on('pointerdown', this.startGame)
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#4af626' }));


        let rulesButton = this.add.text((myWidth / 2) - 40, (myHeight / 2) + 20, 'bash-3.14 ~# ', textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => rulesButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => rulesButton.setStyle({ fill: '#4af626' }));

        let myContext = this;
        /*
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
        this.typewriteText('Rules', rulesButton);
        this.typewriteText('About', aboutButton);
    }

    update()
    {
    }

    startGame()
    {
        console.log("start");
    }

    typewriteText(text, obj)
    {
        const length = text.length
        let i = 0
        this.time.addEvent({
            callback: () => {
                obj.text += text[i]
                ++i
            },
            repeat: length - 1,
            delay: 200
        })
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

    showAbout()
    {
    }
}
