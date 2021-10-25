var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    // Set this for game-over
    // backgroundColor: '#4488aa',
    physics: {
        default: 'arcade',
            arcade: {
                gravity: { z: 200 }
                }
            },
    // TODO: have a menu scene, with the original text.
        scene: {
            preload: preload,
            create: create,
            update: update
        },
    offScreen: 0
    };

    var game = new Phaser.Game(config);
    var maxComputers = 20;
    var computers = ["maccpu","nextcpu","sgicpu","suncpu","palmcpu","os2cpu","bsdcpu"];
    var os = ["wingdows", "apple", "next", "sgi", "sun", "palm", "os2", "bsd", "redhat", "hurd", "linux"];
    var curLevel = 1;
    const MINPC = 6;
    const OSOFFSETX = 9;
    const OSOFFSETY = 7;
    const MAXBILLS = 100;
    var activeComp = '';
    var activeCompNum = 0;
    var deactiveCompNum = 0;
    var curHorde = '';
    var curBill = [];
    var levelCompArr = [];
    var score = 0;

    function preload ()
    {
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

        this.load.image("billL0", "images/billL_0.png");
        this.load.image("billL1", "images/billL_1.png");
        this.load.image("billL2", "images/billL_2.png");
        this.load.image("billR0", "images/billR_0.png");
        this.load.image("billR1", "images/billR_1.png");
        this.load.image("billR2", "images/billR_2.png");

        this.load.spritesheet("spark","images/sparksprite.png", {frameWidth: 20, frameHeight: 20});

    }

    function create ()
    {
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

        // Scoreboard
        const style = { font: "bold 20px Terminal", fill: "#000" };
        this.add.text(10, game.config.height - 50, 'Bill:%d/%d  System:%d/%d/%d  Level:' + curLevel.toString() + '  Score:' + score, style);
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
        var curCompNum = Math.min(8 + curLevel, maxComputers);
        activeCompNum = curCompNum;
        deactiveCompNum = 0;
        var virtCanvasX = 0;
        var virtCanvasY = 0;
        var cpuIndex = 0;
        // Cables to draw, formula from xbill-2.1
        var curCableNum = Math.min(curLevel, curCompNum/2);
        // TODO make sure computers don't overlap
        for(var i = 0; i<curCompNum;i++) {
            cpuIndex = Math.floor(Math.random() * computers.length);
            virtCanvasX = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
            virtCanvasY = Phaser.Math.Between(game.config.height * 0.1, game.config.height * 0.9);
            var tmpComp = this.add.image(0, 0, computers[cpuIndex]);
            var tmpOS = '';
            levelCompArr[i] = this.add.container(virtCanvasX,virtCanvasY, [ tmpComp ]);
            switch (computers[cpuIndex]) {
                case "maccpu":
                    tmpOS = this.add.sprite(-OSOFFSETX, -OSOFFSETY, "apple")
                    levelCompArr[i].add(tmpOS);
                    break;
                case "bsdcpu":
                    tmpOS = this.add.sprite(-OSOFFSETX, -OSOFFSETY, "bsd");
                    levelCompArr[i].add(tmpOS);
                    break;
                case "nextcpu":
                    tmpOS = this.add.sprite(-OSOFFSETX, -OSOFFSETY, "next");
                    levelCompArr[i].add(tmpOS);
                    break;
                case "palmcpu":
                    tmpOS = this.add.sprite(-OSOFFSETX, -OSOFFSETY, "palm");
                    levelCompArr[i].add(tmpOS);
                    break;
                case "sgicpu":
                    tmpOS = this.add.sprite(-OSOFFSETX, -OSOFFSETY, "sgi");
                    levelCompArr[i].add(tmpOS);
                    break;
                case "suncpu":
                    tmpOS = this.add.sprite(-OSOFFSETX, -OSOFFSETY, "sun");
                    levelCompArr[i].add(tmpOS);
                    break;
                case "os2cpu":
                    var pcos = Phaser.Math.Between(6, os.length)
                    tmpOS = this.add.sprite(-OSOFFSETX, -OSOFFSETY, os[pcos]);
                    levelCompArr[i].add(tmpOS);
                    break;
            }
            levelCompArr[i].setSize(55,45);
            levelCompArr[i].setDepth(20);
            this.physics.world.enable(levelCompArr[i]);
        }

        for (var i = 0; i<curCableNum ; i++) {
            var tComp1ID = Phaser.Math.Between(0, curCompNum-1);
            var tComp2ID = tComp1ID;
            while (tComp1ID == tComp2ID ) {
                tComp2ID = Phaser.Math.Between(0, curCompNum-1);
            }

            levelCompArr[tComp1ID].setDepth(10);
            levelCompArr[tComp2ID].setDepth(10);

            var myLine =  new Phaser.Geom.Line(levelCompArr[tComp1ID].x, levelCompArr[tComp1ID].y, levelCompArr[tComp2ID].x, levelCompArr[tComp2ID].y);
            var graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });
            graphics.strokeLineShape(myLine);
        }

        // Setup Bill horde
        // curMaxBills = Math.min((8 + 3 * curLevel) * Game_scale(2));
        // Original game tries to scale number of bills according to the game board dimensions
        var curMaxBills = Math.min((8 + 3 * curLevel) , MAXBILLS);
        for(var i = 0 ; i < curMaxBills; i++) {
            // 0 add bill just behind the x axis
            // 1 add bill just behind the y axis
            xory = Phaser.Math.Between(0,1);
            var randComp = Phaser.Math.Between(0, computers.length);
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
            var tmpBill = this.add.sprite(0, 0, billImage).play(billAnim);
            // curBill[i] = this.add.container(billStartPointX, billStartPointY, [tmpBill, tmpWin]);
            curBill[i] = this.add.container(billStartPointX, billStartPointY);
            curBill[i].addAt(tmpWin, 0);
            curBill[i].addAt(tmpBill, 1);
            curBill[i].setDepth(23);
            curBill[i].setSize(28, 42);
            curBill[i].setInteractive();
            curBill[i].setData("ingame", "false");
            curBill[i].setData("dead", "false");
            this.physics.world.enable(curBill[i]);
            curBill[i].on('pointerdown', function() {
                var deadBill = this.getAt(1);
                if (deadBill == undefined ) {
                    return;
                }
                this.setData("dead", "true");
                this.body.stop();
                this.removeInteractive();
                // Famous last words: we should only have two object
                // in the container, Bill & payload
                if (this.getAt(0).texture.key == "wingdows") {
                    this.removeAt(0, true);
                } else {
                    let goodOS = this.removeAt(0, false);
                    // TODO this animate
                    goodOS.x = this.x;
                    goodOS.y = this.y;
                    goodOS.setInteractive();
                    goodOS.setActive(true).setVisible(true);
                }
                console.log("aaa");

                // Remove this container from available Bills
                const index = curBill.indexOf(this);
                if (index > -1) {
                    curBill.splice(index, 1);
                }

                deadBill.play('billDAnim');
               // var explosion = new billDies(this, deadBill.x, deadBill.y);
                deadBill.once('animationcomplete', ()=>{ 
                    console.log('animationcomplete')
                    deadBill.setActive(false).setVisible(false);
                    deadBill.destroy();
                });

                this.destroy();
            });
            // curBill[i].self.on('pointerdown', this.onBillClick, this);
        }

        game.config.offScreen = curBill.length;
        var timer = this.time.addEvent({
            delay: 200,                // ms
            callback: timerCallback,
            args: [game.config.offScreen],
            callbackScope: this,
            loop: true
        });

    }

    function timerCallback(billsLeft) {
        if (this.game.config.offScreen > 0) {
            let launched = billLaunch(curLevel, this, billsLeft);
            this.game.config.offScreen = this.game.config.offScreen - launched;
        } else {
            console.log("No more Bills left!")
        }
    }

    function update()
    {
        console.log(game.config.offScreen);
        /*
        if (offScreen > 0) {
            score += (level * efficiency / iteration);
        }
        */
    }

    function billLaunch(level, t, billNum)
    {
        // Original xbill 2.1 formula
        var minBill = Math.min(2 + level / 4, 12);
        var n = Phaser.Math.Between(1, Math.min(minBill, billNum));
        console.log("Should release" + n + "Bills");
        for (;n>0;n--) {
            var myBill = Phaser.Utils.Array.GetRandom(curBill);
            // console.log(myBill.getData("ingame"));
            if (myBill == null || myBill.getData("ingame") == true || myBill.getData("dead") == true) {
                continue;
            }
            myBill.setData("ingame", "true");
            var myCPU = Phaser.Utils.Array.GetRandom(levelCompArr);
            // console.log(myBill);
            t.physics.moveToObject(myBill, myCPU, 100);
            t.physics.add.overlap(myBill, myCPU, replaceOS, null, t);
        }

        return n;
    }

    function replaceOS(myBill, myCPU)
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
                return;
               //this.physics.moveTo(myBill, 100, 100);
            }

            myBill.removeAt(0);
            myCPU.removeAt(1);

            myBill.addAt(goodOS, 0);
            myCPU.addAt(wingdows, 1);

            goodOS.setPosition(0, -20);
            wingdows.setPosition(-OSOFFSETX, -OSOFFSETY);

            xory = Phaser.Math.Between(0,1);
            var x = 0;
            var y = 0;
            if (xory == 0 ) {
                x = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
                y = -30;
            } else {
                x = -30;
                y = Phaser.Math.Between(game.config.height * 0.1, game.config.height * 0.9);
            }

            this.physics.moveTo(myBill, x, y, 20);
        }
    }


    function hordeSetup(t, curLevel)
    {
    }

