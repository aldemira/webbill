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

class webBill extends baseScene
{
    curLevel;

    constructor()
    {
        super('webBill');

        this.maxComputers = 20;
        this.computers = ["maccpu","nextcpu","sgicpu","suncpu","palmcpu","os2cpu","bsdcpu"];
        this.os = ["wingdows", "apple", "next", "sgi", "sun", "palm", "os2", "bsd", "redhat", "hurd", "linux"];
        this.MINPC = 6;
        this.OSOFFSETX = -9;
        this.OSOFFSETY = -7;
        this.MAXBILLS = 100;
        this.activeComp = '';
        this.activeCompNum = 0;
        this.deactiveCompNum = 0;
        this.curHorde = '';
        this.curBill = [];
        this.levelCompArr = [];
        this.score = 0;
        this.timeString = ':';
        this.timeText = '';
        this.volImg = '';
        // this.offScreen = 0;
        this.billTimer = '';
        this.efficiency = 1;
        this.iteration = 1;
        this.aliveBills = 0;
        this.scoreText = '';
        this.offScreenBillList = [];
    }

    init(props)
    {
        const { level = 1 } = props;
        this.curLevel = level
    }

    preload()
    {
        super.preload();
        // Load sounds
        this.load.audio("winding", "sounds/win31.mp3");

        // Load start menu related items
        this.load.image("xlogo", "images/X11.svg");
        this.load.image("shutdown", "images/shutdown.png");

        // Load CPU images
        this.load.image("maccpu", "images/maccpu.png");
        this.load.image("nextcpu", "images/nextcpu.png");
        this.load.image("sgicpu", "images/sgicpu.png");
        this.load.image("suncpu", "images/suncpu.png");
        this.load.image("palmcpu", "images/palmcpu.png");
        this.load.image("os2cpu", "images/os2cpu.png");
        this.load.image("bsdcpu", "images/bsdcpu.png");
        // Load toaster
        this.load.image("toaster", "images/toaster.png");
        // Load bucket
        this.load.image("bucket", "images/bucket.png");
        // Load OS Sprites
        this.load.image("wingdows", "images/wingdows.png");
        this.load.image("apple", "images/apple.png");
        this.load.image("next", "images/next.png");
        this.load.image("sgi", "images/sgi.png");
        this.load.image("sun", "images/sun.png");
        this.load.image("palm", "images/palm.png");
        this.load.image("bsd", "images/bsd.png");
        this.load.image("linux", "images/linux.png");
        this.load.image("redhat", "images/redhat.png");
        this.load.image("hurd", "images/hurd.png");
        this.load.image("os2", "images/os2.png");

        // Can't do sprite sheets, this will do.
        this.load.image('billD1', 'images/billD_0.png');
        this.load.image('billD2', 'images/billD_1.png');
        this.load.image('billD3', 'images/billD_2.png');
        this.load.image('billD4', 'images/billD_3.png');
        this.load.image('billD5', 'images/billD_4.png');

        this.load.spritesheet("spark","images/sparksprite.png", {frameWidth: 20, frameHeight: 20});

    }

    create()
    {
        super.create();
        var div = document.getElementById('gameContainer');
        div.style.backgroundColor = "#FFFFFF"; // Window maker Default Style

        // Scene specific animations
        this.anims.create({
            key: 'billDAnim',
            frames: [
                { key: 'billD1', frame: 0},
                { key: 'billD2', frame: 1},
                { key: 'billD3', frame: 2},
                { key: 'billD4', frame: 3},
                { key: 'billD5', frame: 4}
            ],
            frameRate: 6,
            repeat: 0
        });

        this.anims.create({
            key: 'flame',
            frames: this.anims.generateFrameNumbers('spark',{frames: [0, 1]}),
            frameRate: 3,
            repeat: -1
        });

        // Bucket setup
        var bucket = this.physics.add.sprite(20, 20, "bucket").setInteractive();
        this.input.setDraggable(bucket);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        /*
        this.input.on('dragend', function (pointer, gameObject) {
            gameObject.clearTint();
        });
        */
        // Create Computers and Networks
        // Computers to draw, formula from xbill-2.1
        let curCompNum = Math.min(8 + this.curLevel, this.maxComputers);
        this.activeCompNum = curCompNum;
        this.deactiveCompNum = 0;
        let virtCanvasX = 0;
        let virtCanvasY = 0;
        let cpuIndex = 0;
        // Cables to draw, formula from xbill-2.1
        let curCableNum = Math.min(this.curLevel, curCompNum/2);
        // TODO make sure computers don't overlap
        for(var i = 0; i<curCompNum;i++) {
            cpuIndex = Math.floor(Math.random() * this.computers.length);
            virtCanvasX = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
            virtCanvasY = Phaser.Math.Between(game.config.height * 0.1, game.config.height * 0.9);
            var tmpComp = this.add.image(0, 0, this.computers[cpuIndex]);
            var tmpOS = '';
            this.levelCompArr[i] = this.add.container(virtCanvasX,virtCanvasY, [ tmpComp ]);
            switch (this.computers[cpuIndex]) {
                case "maccpu":
                    tmpOS = this.add.sprite(this.OSOFFSETX, this.OSOFFSETY, "apple")
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "bsdcpu":
                    tmpOS = this.add.sprite(this.OSOFFSETX, this.OSOFFSETY, "bsd");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "nextcpu":
                    tmpOS = this.add.sprite(this.OSOFFSETX, this.OSOFFSETY, "next");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "palmcpu":
                    tmpOS = this.add.sprite(this.OSOFFSETX, this.OSOFFSETY, "palm");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "sgicpu":
                    tmpOS = this.add.sprite(this.OSOFFSETX, this.OSOFFSETY, "sgi");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "suncpu":
                    tmpOS = this.add.sprite(this.OSOFFSETX, this.OSOFFSETY, "sun");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "os2cpu":
                    var pcos = Phaser.Math.Between(6, this.os.length)
                    tmpOS = this.add.sprite(this.OSOFFSETX, this.OSOFFSETY, this.os[pcos]);
                    this.levelCompArr[i].add(tmpOS);
                    break;
            }
            this.levelCompArr[i].setSize(55,45).setDepth(20);
            this.physics.world.enable(this.levelCompArr[i]);
        }

        for (var i = 0; i<curCableNum ; i++) {
            let tComp1ID = Phaser.Math.Between(0, curCompNum-1);
            let tComp2ID = tComp1ID;
            while (tComp1ID == tComp2ID ) {
                tComp2ID = Phaser.Math.Between(0, curCompNum-1);
            }

            this.levelCompArr[tComp1ID].setDepth(10);
            this.levelCompArr[tComp2ID].setDepth(10);

            // let myLine =  new Phaser.Geom.Line(this.levelCompArr[tComp1ID].x, 
            let myLine =  new Phaser.Curves.Line([this.levelCompArr[tComp1ID].x, 
                this.levelCompArr[tComp1ID].y,
                this.levelCompArr[tComp2ID].x,
                this.levelCompArr[tComp2ID].y]);
            let tempPath = this.add.path();
            tempPath.add(myLine);
            var netGraphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });
            tempPath.draw(netGraphics);
        }

        // Setup Bill horde
        // curMaxBills = Math.min((8 + 3 * curLevel) * Game_scale(2));
        // Original game tries to scale number of bills according to the game board dimensions
        let curMaxBills = Math.min((8 + 3 * this.curLevel) , this.MAXBILLS);
        for(let i = 0 ; i < curMaxBills; i++) {
            // Maintain the index of off screen Bills
            this.offScreenBillList.push(i);
            // 0 add bill just behind the x axis
            // 1 add bill just behind the y axis
            let xory = Phaser.Math.Between(0,1);
            let randComp = Phaser.Math.Between(0, this.computers.length);
            if (xory == 0) {
                var billStartPointY = Phaser.Math.Between(game.config.height * 0.1, game.config.height * 0.9);
                var billStartPointX = -30;
                var billImage = 'billR0';
                var billAnim = 'billRAnim';
            } else {
                var billStartPoint = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
                if ( billStartPoint >= game.config.width / 2 ) {
                    var billImage = 'billL0';
                    var billAnim = 'billLAnim';
                } else {
                    var billImage = 'billR0';
                    var billAnim = 'billRAnim';
                }
                var billStartPointX = Phaser.Math.Between(game.config.height * 0.1, game.config.height * 0.9);
                var billStartPointY = -30;
            }

            var tmpWin = this.add.image(0, -20, 'wingdows');
            let tmpBill = this.add.sprite(0, 0, billImage).play(billAnim);
            // curBill[i] = this.add.container(billStartPointX, billStartPointY, [tmpBill, tmpWin]);
            this.curBill[i] = this.add.container(billStartPointX, billStartPointY);
            this.curBill[i].addAt(tmpWin, 0);
            this.curBill[i].addAt(tmpBill, 1);
            this.curBill[i].setDepth(23)
                .setSize(28, 42)
                .setInteractive()
                .setData("ingame", "false")
                .setData("dead", "false");
            this.physics.world.enable(this.curBill[i]);

            // Kill Bill
            this.curBill[i].on('pointerdown', function() {
                let deadBillContainer = this.curBill[i];
                var deadBill = deadBillContainer.getAt(1);
                if (deadBill == undefined ) {
                    return;
                }
                deadBillContainer.setData("dead", "true");
                deadBillContainer.body.stop();
                // tmpBill.removeInteractive();
                // Famous last words: we should only have two object
                // in the container, Bill & payload
                
                deadBill.play('billDAnim');
                deadBill.once('animationcomplete', ()=>{ 
                    deadBill.setActive(false).setVisible(false);

                    if (deadBillContainer.getAt(0).texture.key == "wingdows") {
                        deadBillContainer.getAt(0).setActive(false).setVisible(false);
                        deadBillContainer.removeInteractive();
                    } else {
                        // TODO this animate
                        // I hate js
                        deadBillContainer.getAt(0).setX(deadBill.x).setY(deadBill.y);
                        deadBillContainer.setInteractive();
                        this.input.setDraggable(deadBillContainer);
                    }
                });

                this.aliveBills--;
            }.bind(this));
        } // End for (bill setup)

        // this.offScreen = curMaxBills;
        this.aliveBills = curMaxBills;
        this.billTimer = this.time.addEvent({
            delay: 200,                // ms
            callback: this.timerCallback,
            args: [],
            callbackScope: this,
            loop: true
        });

        const menuStyle = {fontFamily: "Menlo Regular", fontSize: 12, fill: "#000"};
        let bottomBarGraph = this.add.graphics();
        let alpha = 0.5 + ((0 / 10) * 0.5);
        let bottomBar = this.add.container(0, game.config.height);
        bottomBarGraph.fillStyle(0x787878, alpha);
        // let outerRect = graphics.fillRect(0, game.config.height - 40, game.config.width, 40);
        let outerRect = bottomBarGraph.fillRect(0, -40, game.config.width, 40);
        bottomBar.add(outerRect);

        // Scoreboard
        this.scoreText = this.add.text(60,-20, 'Bill:%d/%d  System:%d/%d/%d  Level:' + this.curLevel.toString() + '  Score:' + this.score, menuStyle);
        bottomBar.add(this.scoreText);
        let menuText = this.add.image(25, -20, "xlogo").setDisplaySize(25,20).setDepth(1);
        bottomBar.add(menuText);
        bottomBarGraph.lineStyle(2, 0x000000, 1);
        let menuOuterRect = bottomBarGraph.strokeRect(2, -35, 50, 30).setDepth(2);
        bottomBar.add(menuOuterRect);
        bottomBarGraph.lineStyle(2, 0xffffff, 0.5);
        let menuOuterRectShadow = bottomBarGraph.strokeRect(2, -33, 48, 28).setDepth(3);
        bottomBar.add(menuOuterRectShadow);

        this.timeText = this.add.text(game.config.width - 50, -25, this.timeString, menuStyle).setDepth(2);
        bottomBar.add(this.timeText);


        this.updateTime();
        let clockTimer = this.time.addEvent({
            delay: 60000,
            callback: this.updateTime,
            callbackScope: this,
            loop: true
        });

        let myIcon = '';
        if (this.sound.mute) {
            myIcon = "volume-mute";
        } else {
            myIcon = "volume-unmute";
        }

        this.volImg = this.add.image(game.config.width-70, -20, myIcon)
            .setDisplaySize(24,24)
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', this.muteSound, this);
        bottomBar.add(this.volImg);

        let menuGraph = this.add.graphics();
        menuGraph.fillStyle(0x787878, alpha);
        // startContainer = this.add.container(5,game.config.height-100);
        let startContainer = this.add.container(2,game.config.height-202).setVisible(false);
        let startMenu = menuGraph.fillRect(0, -40, 100, 200);
        startContainer.add(startMenu);
        startContainer.add(this.add.text(30, 138, "Shutdown", menuStyle)
            .setInteractive()
            .on('pointerdown', () => {this.scene.start('gameMenu')}));
        startContainer.add(this.add.image(15,145, "shutdown")
            .setInteractive()
            .on('pointerdown', () => {this.scene.start('gameMenu')})
            .setDisplaySize(24,24));

        menuText.setInteractive()
            .on('pointerdown', () => {startContainer.setVisible(!startContainer.visible); this.scene.pause(startContainer.visible);}, this);

    }

    timerCallback() {
        if (this.offScreenBillList.length > 0) {
            let launched = this.billLaunch();
            console.log("Launched:" + launched);
        }
    }

    update()
    {
        // super.update();
        if (this.offScreenBillList.length > 0) {
            this.score += (this.curLevel * this.efficiency / this.iteration);
        } else {
            this.billTimer.remove();
        }
        console.log("Alive bills:" + this.aliveBills + " Offscreen: " + this.offScreenBillList.length);
        this.scoreText.text =  'Bill:%d/%d  System:%d/%d/%d  Level:' + this.curLevel.toString() + '  Score:' + this.score.toString();

        if (this.aliveBills <= 0 ) {
            console.log('Level done!');
            // this.scene.pause();
            this.showLevelDone();
        }
    }

    billLaunch()
    {
        // Original xbill 2.1 formula
        var minBill = Math.min(2 + this.curLevel / 4, 12);
        var n = Phaser.Math.Between(1, Math.min(minBill, this.offScreenBillList.length));
        console.log("Should release" + n + "Bills");
        let retVal = n;
        for (;n>0;n--) {
            let myBillIndex = Phaser.Utils.Array.GetRandom(this.offScreenBillList);
            const tmpIndex = this.offScreenBillList.indexOf(myBillIndex);
            if (tmpIndex > -1) {
                this.offScreenBillList.splice(tmpIndex, 1);
            } else {
                continue;
            }
            let myBill = this.curBill[myBillIndex];
            myBill.setData("ingame", "true");
            var myCPU = Phaser.Utils.Array.GetRandom(this.levelCompArr);
            this.physics.moveToObject(myBill, myCPU, 20);
            this.physics.add.overlap(myBill, myCPU, this.replaceOS, null, this);
        }

        return retVal;
    }

    replaceOS(myBill, myCPU)
    {
        var touching = !myCPU.body.touching.none;
        var wasTouching = !myCPU.body.wasTouching.none;
        // Do not fire collision second time!
        if (touching && !wasTouching) {
            console.log("warning bill is replacing the OS!")

            myBill.body.stop();
            var wingdows = myBill.getAt(0);
            var goodOS = myCPU.getAt(1);

            if (goodOS == undefined || goodOS.texture.key == "wingdows") {
                // Choose a random cpu and work on it.
                // XXX turn this code into a function
                var myCPU = Phaser.Utils.Array.GetRandom(this.levelCompArr);
                this.physics.moveToObject(myBill, myCPU, 20);
                this.physics.add.overlap(myBill, myCPU, this.replaceOS, null, this);
                return;
               //this.physics.moveTo(myBill, 100, 100);
            }

            myBill.removeAt(0);
            myCPU.removeAt(1);

            myBill.addAt(goodOS, 0);
            myCPU.addAt(wingdows, 1);

            goodOS.setPosition(0, -20);
            wingdows.setPosition(this.OSOFFSETX, this.OSOFFSETY);

            this.sound.play('winding');

            let xory = Phaser.Math.Between(0,1);
            let x = 0;
            let y = 0;
            if (xory == 0 ) {
                x = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
                y = -30;
            } else {
                x = -30;
                y = Phaser.Math.Between(game.config.height * 0.1, game.config.height * 0.9);
            }

            this.physics.moveTo(myBill, x, y, 20);
            //this.physics.remove.overlap(myBill, myCPU);
        }
    }

    updateTime() {
        let time = new Date();

        let hours = time.getHours();
        let minutes = time.getMinutes();

        if (hours < 10) {
                hours = "0" + hours;
            }
        if (minutes < 10) {
                minutes = "0" + minutes;
        }

        this.timeString = hours + ":" + minutes;
        this.timeText.text = this.timeString;
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

    showLevelDone()
    {
        const mybutton = this.createButton(50, 50, 'Next Level', () => this.scene.restart({level: this.curLevel+1}));
    }

    createSpark()
    {
      // #define SPARK_SPEED 4
      // #define SPARK_DELAY(level) (MAX(20 - (level), 0))
      /*
       * Remove timer (SPARK_DELAY)
       * Set collision with the destionation
       * Run animation
       * Move it towards the cable
       * If not put out kill dest os
       */
      // wingdows.play('flame');
    }

    hordeSetup(t, curLevel)
    {
    }
}
