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

import baseScene from './basescene.js';
import wmaker from './wmaker.js';

const OSOFFSETX = -9;
const OSOFFSETY = -7;
const MINPC = 6;
const computers = ["maccpu","nextcpu","sgicpu","suncpu","palmcpu","os2cpu","bsdcpu"];
const os = ["wingdows", "apple", "next", "sgi", "sun", "palm", "os2", "bsd", "redhat", "hurd", "linux"];
const MAXBILLS = 100;
const CPU_OS_MAP = {
    "maccpu": "apple",
    "bsdcpu": "bsd",
    "nextcpu": "next",
    "palmcpu": "palm",
    "sgicpu": "sgi",
    "suncpu": "sun",
    // "os2cpu" needs special handling
};


export default class webBill extends baseScene
{


    constructor()
    {
        super({ key:'webBill'});

        this.cables = [];
        this.curLevel = 0;
        this.maxComputers = 20;
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
        this.curLevel = level;
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
        this.cameras.main.setBackgroundColor('#FFFFFF');

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
        this.computerPhysicsGroup = this.physics.add.group()
        for(var i = 0; i<curCompNum;i++) {
            cpuIndex = Math.floor(Math.random() * computers.length);
            virtCanvasX = Phaser.Math.Between(this.game.config.width * 0.1, this.game.config.width * 0.9);
            virtCanvasY = Phaser.Math.Between(this.game.config.height * 0.1, this.game.config.height * 0.9);
            const cpuType = computers[cpuIndex];
            var tmpComp = this.add.image(0, 0, cpuType);
            var tmpOSImageKey = CPU_OS_MAP[cpuType];
            var tmpOS = null;

            if (tmpOSImageKey) {
                tmpOS = this.add.sprite(OSOFFSETX, OSOFFSETY, tmpOSImageKey);
            } else if (cpuType === "os2cpu") {
                // Keep special logic for os2cpu
                const pcOsIndex = Phaser.Math.Between(os.indexOf("os2"), os.length - 1); // More robust index finding
                tmpOS = this.add.sprite(OSOFFSETX, OSOFFSETY, os[pcOsIndex]);
            }
            this.levelCompArr[i] = this.add.container(virtCanvasX, virtCanvasY, [tmpComp]);
            this.levelCompArr[i].add(tmpOS);
            this.levelCompArr[i].setData('originalOS', tmpOS.texture.key); // Store original OS
            this.levelCompArr[i].setData('infected', false);

            this.levelCompArr[i].setSize(55,45).setDepth(20);
            this.physics.world.enable(this.levelCompArr[i]);
            const body = this.levelCompArr[i].body;
            body.setCollideWorldBounds(true);
            body.setBounce(0.6);
            body.setDrag(100);
            body.setVelocity(Phaser.Math.Between(-30, 30), Phaser.Math.Between(-30, 30));
            this.computerPhysicsGroup.add(this.levelCompArr[i]);
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
        let curMaxBills = Math.min((8 + 3 * this.curLevel) , MAXBILLS);
        for(let i = 0 ; i < curMaxBills; i++) {
            // Maintain the index of off screen Bills
            this.offScreenBillList.push(i);
            // 0 add bill just behind the x axis
            // 1 add bill just behind the y axis
            let xory = Phaser.Math.Between(0,1);
            let randComp = Phaser.Math.Between(0, computers.length);
            if (xory == 0) {
                var billStartPointY = Phaser.Math.Between(this.game.config.height * 0.1, this.game.config.height * 0.9);
                var billStartPointX = -30;
                var billImage = 'billR0';
                var billAnim = 'billRAnim';
            } else {
                var billStartPoint = Phaser.Math.Between(this.game.config.width * 0.1, this.game.config.width * 0.9);
                if ( billStartPoint >= this.game.config.width / 2 ) {
                    var billImage = 'billL0';
                    var billAnim = 'billLAnim';
                } else {
                    var billImage = 'billR0';
                    var billAnim = 'billRAnim';
                }
                var billStartPointX = Phaser.Math.Between(this.game.config.height * 0.1, this.game.config.height * 0.9);
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
                deadBillContainer.disableInteractive();
                var deadBill = deadBillContainer.getAt(1);
                if (deadBill == undefined ) {
                    return;
                }
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
        let bottomBar = this.add.container(0, this.game.config.height);
        bottomBarGraph.fillStyle(0x787878, alpha);
        // let outerRect = graphics.fillRect(0, this.game.config.height - 40, this.game.config.width, 40);
        let outerRect = bottomBarGraph.fillRect(0, -40, this.game.config.width, 40);
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

        this.timeText = this.add.text(this.game.config.width - 50, -25, this.timeString, menuStyle).setDepth(2);
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

        this.volImg = this.add.image(this.game.config.width-70, -20, myIcon)
            .setDisplaySize(24,24)
            .setInteractive()
            .setDepth(2)
            .on('pointerdown', this.muteSound, this);
        bottomBar.add(this.volImg);

        let menuGraph = this.add.graphics();
        menuGraph.fillStyle(0x787878, alpha);
        // startContainer = this.add.container(5,this.game.config.height-100);
        let startContainer = this.add.container(2,this.game.config.height-202).setVisible(false);
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

        this.monitorInfectedComputers();
    }

    timerCallback() {
        if (this.offScreenBillList.length > 0) {
            let launched = this.billLaunch();
            console.log("Launched:" + launched);
        }
    }

    // NEW: Restore computer when OS is dragged back
    restoreComputer(os, computer) {
        if (os.getData('dragging')) return; // Ignore while dragging

        // Check if this OS matches the computer's original OS and it's infected
        if (this.computerOsMap.get(computer) === os.texture.key && computer.getData('infected')) {
            // Find and destroy the Windows icon on this computer
            this.windows.getChildren().forEach(win => {
                if (Phaser.Math.Distance.Between(win.x, win.y, computer.x, computer.y) < 10) {
                    win.destroy();
                }
            });

            // Snap OS to computer and disable dragging
            os.setPosition(computer.x, computer.y);
            os.disableInteractive();
            os.setDepth(1);

            // Reset computer state
            computer.setData('infected', false);
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
        // console.log("Alive bills:" + this.aliveBills + " Offscreen: " + this.offScreenBillList.length);
        this.scoreText.text =  'Bill:'+ this.aliveBills +'/%d  System:%d/'+this.deactiveCompNum+'/'+this.activeCompNum+'  Level:' + this.curLevel.toString() + '  Score:' + this.score.toString();

        if (this.aliveBills <= 0 && this.deactiveCompNum == 0) {
            var infected = false;
            for (var i=0;i<this.levelCompArr.length;i++) {
                if (this.levelCompArr[i].getData('infected') == true) {
                    infected = true;
                }
            }
            //console.log('Level done!');
            if (infected == false) {
                this.showLevelDone();
                this.pauseGame();
            }
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
            wingdows.setPosition(OSOFFSETX, OSOFFSETY);

            this.sound.play('winding');

            let xory = Phaser.Math.Between(0,1);
            let x = 0;
            let y = 0;
            if (xory == 0 ) {
                x = Phaser.Math.Between(this.game.config.width * 0.1, this.game.config.width * 0.9);
                y = -30;
            } else {
                x = -30;
                y = Phaser.Math.Between(this.game.config.height * 0.1, this.game.config.height * 0.9);
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
        this.game.sound.mute = !this.game.sound.mute;
        if (this.game.sound.mute) {
            myIcon = "volume-mute";
        } else {
            myIcon = "volume-unmute";
        }
        this.volImg.setTexture(myIcon);
    }

    showLevelDone()
    {
        let mainWindow = new wmaker(this);
        // Get canvas dimensions from the game config
        const canvasWidth = this.sys.game.config.width;
        const canvasHeight = this.sys.game.config.height;

        const windowWidth = 430;
        const windowHeight = 375;

        // Calculate centered coordinates
        const centerX = (canvasWidth / 4) - (windowWidth / 2);
        const centerY = (canvasHeight / 4) - (windowHeight / 2);

        let levelDoneWindow = mainWindow.createXWindow(this.game.renderer.width/2, this.game.renderer.height/2, windowWidth, windowHeight, 'Level Done!', false, 100);
        let textStyle = { fontFamily: "Menlo Regular", fill: "#000", align: "left", fontSize: "14px", backgroundColor: '#fff' };
        let donetext = this.add.text(10, 30, 'Level '+ this.curLevel.toString() +' done!', textStyle)
            .setOrigin(0)
            .setDepth(1);
        levelDoneWindow.add(donetext);
        donetext = this.add.text(50, 50, 'Next Level', textStyle)
            .setInteractive()
            .setOrigin(0)
            .setDepth(1);
        donetext.on('pointerdown', () => { 
            this.resumeGame();
            this.scene.restart({level: this.curLevel+1}) 
        });
        levelDoneWindow.add(donetext);
    }

    pauseGame()
    {
        // this.anims.pauseAll();
        this.physics.pause();
        this.tweens.pauseAll();
    }

    resumeGame()
    {
        this.anims.resumeAll();
        this.physics.resume();
        this.tweens.resumeAll();
    }

    createSparkOld()
    {
        let spark = this.add.sprite(x, y, 'spark')
            .play('flame') // Play the flame animation
            .setDepth(25); // Ensure it's above other objects

        this.time.delayedCall(500, () => {
            spark.destroy(); // Remove the spark after 500ms
        });
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

    createSpark(infectedComputer) {
        // Constants for spark behavior
        const SPARK_SPEED = 100;
        const SPARK_DAMAGE_DELAY = 3000; // 3 seconds before spark starts

        // Find connected computers through cables
        const connectedComputers = this.findConnectedComputers(infectedComputer);

        if (connectedComputers.length === 0) {
            return; // No connected computers to spread to
        }

        // Create the spark sprite
        const spark = this.add.sprite(
            infectedComputer.x,
            infectedComputer.y,
            'spark'
        ).play('flame');

        spark.setDepth(30); // Make sure spark appears above cables
        this.physics.world.enable(spark);

        // For each connected computer, create a spark that travels along the cable
        connectedComputers.forEach(targetComputer => {
            // Create a timer for the 3 second delay
            this.time.addEvent({
                delay: SPARK_DAMAGE_DELAY,
                callback: () => {
                    // Calculate the path along the cable
                    const path = new Phaser.Curves.Line([
                        infectedComputer.x,
                        infectedComputer.y,
                        targetComputer.x,
                        targetComputer.y
                    ]);

                    // Clone the spark for this path
                    const pathSpark = this.add.sprite(
                        infectedComputer.x,
                        infectedComputer.y,
                        'spark'
                    ).play('flame');

                    pathSpark.setDepth(30);
                    this.physics.world.enable(pathSpark);

                    // Calculate the distance and time needed for travel
                    const distance = Phaser.Math.Distance.Between(
                        infectedComputer.x,
                        infectedComputer.y,
                        targetComputer.x,
                        targetComputer.y
                    );
                    const travelTime = (distance / SPARK_SPEED) * 1000; // Convert to milliseconds

                    // Create the tween to move the spark along the cable
                    this.tweens.add({
                        targets: pathSpark,
                        x: targetComputer.x,
                        y: targetComputer.y,
                        duration: travelTime,
                        ease: 'Linear',
                        onComplete: () => {
                            // When spark reaches target, infect the computer if not protected
                            this.infectComputer(targetComputer, pathSpark);
                        }
                    });
                },
                callbackScope: this
            });
        });
    }

    // Helper method to find computers connected by cables
    findConnectedComputers(sourceComputer) {
        const connectedComputers = [];

        // Get all computers that have cables connecting to the source computer
        this.levelCompArr.forEach(computer => {
            if (computer !== sourceComputer) {
                // Check if there's a cable between these computers
                const cable = this.findCable(sourceComputer, computer);
                if (cable) {
                    connectedComputers.push(computer);
                }
            }
        });

        return connectedComputers;
    }

    // Helper method to find a cable between two computers
    findCable(comp1, comp2) {
        // This would need to be adapted based on how you're storing cable information
        // For now, we'll assume cables are stored in a cables array
        return this.cables.find(cable =>
            (cable.start === comp1 && cable.end === comp2) ||
            (cable.start === comp2 && cable.end === comp1)
        );
    }

    // Helper method to infect a computer
    infectComputer(computer, spark) {
        // Check if the computer isn't already infected and doesn't have protection
        const os = computer.getAt(1); // Get the OS sprite from the container

        if (os && os.texture.key !== "wingdows") {
            // Store the original OS
            const originalOS = os.texture.key;

            // Replace with Wingdows
            computer.removeAt(1);
            const wingdows = this.add.sprite(OSOFFSETX, OSOFFSETY, "wingdows");
            computer.addAt(wingdows, 1);
            computer.setData('infected', true);

            // Play infection sound
            this.sound.play('winding');

            // Create a visual effect for the infection
            const infectEffect = this.add.sprite(computer.x, computer.y, 'spark')
                .play('flame')
                .setDepth(35);

            // Remove the effect after animation
            this.time.addEvent({
                delay: 1000,
                callback: () => {
                    infectEffect.destroy();
                },
                callbackScope: this
            });
        }

        // Destroy the spark sprite
        spark.destroy();
    }

    monitorInfectedComputers() {
        // Check every second for computers that have been infected
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.levelCompArr.forEach(computer => {
                    const os = computer.getAt(1);
                    if (os && os.texture.key === "wingdows") {
                        // If computer doesn't have a spark timer, start one
                        if (!computer.getData('sparkTimer')) {
                            computer.setData('sparkTimer', this.time.now);
                        } else if (this.time.now - computer.getData('sparkTimer') >= 3000) {
                            // If 3 seconds have passed, create spark
                            this.createSpark(computer);
                            // Reset timer
                            computer.setData('sparkTimer', null);
                        }
                    } else {
                        // Reset timer if computer is no longer infected
                        computer.setData('sparkTimer', null);
                    }
                });
            },
        callbackScope: this,
        loop: true
        });
    }
}
