class gameMenu extends baseScene
{
    constructor()
    {
        super('gameMenu');
    }

    preload()
    {
        super.preload();
        this.load.image("logo", "images/logo.png");
        this.load.audio("hdd", "sounds/hdd_sound.ogg")
    }

    create()
    {
        super.create();
        let myWidth = this.game.renderer.width;
        let myHeight = this.game.renderer.height;
        this.add.image(myWidth / 2, myHeight * 0.2, 'logo').setDepth(1);
        let bill1 = this.add.sprite(0, 0, 'billL0').play('billLAnim');
        let bill2 = this.add.sprite(0, 0, 'billR0').play('billRAnim');
        let win1 = this.add.image(0, -20, 'wingdows');
        let win2 = this.add.image(0, -20, 'wingdows');
        let container1 = this.add.container((myWidth / 2 ) - 200, myHeight * 0.2, [win1, bill1]);
        let container2 = this.add.container((myWidth / 2 ) + 200, myHeight * 0.2, [win2, bill2]);

        const textStyle = { font: "bold 30px Terminal", fill: "#4af626" };
        let startButton = this.add.text(myWidth / 2, (myHeight / 2) - 50, 'Start game', textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.startGame)
            .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => startButton.setStyle({ fill: '#4af626' }));

        let rulesButton = this.add.text(myWidth / 2, (myHeight / 2) + 20, 'Rules', textStyle)
            .setOrigin(0.5)
            .setPadding(10)
            .setDepth(1)
            .setStyle({ backgroundColor: '#111' })
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', this.showRules)
            .on('pointerover', () => rulesButton.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => rulesButton.setStyle({ fill: '#4af626' }));

        this.sound.play('hdd',{
            loop: true
        });
    }

    update()
    {
    }

    startGame()
    {
        console.log("start");
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
        this.game.load.plugin('rexscaleplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexscaleplugin.min.js', true);
        scene.plugins.get('rexscaleplugin').popup(ruleText, 0);
    }
}
