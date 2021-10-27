class webBill extends baseScene
{
    constructor()
    {
        super('webBill');

        this.maxComputers = 20;
        this.computers = ["maccpu","nextcpu","sgicpu","suncpu","palmcpu","os2cpu","bsdcpu"];
        this.os = ["wingdows", "apple", "next", "sgi", "sun", "palm", "os2", "bsd", "redhat", "hurd", "linux"];
        this.curLevel = 1;
        this.MINPC = 6;
        this.OSOFFSETX = 9;
        this.OSOFFSETY = 7;
        this.MAXBILLS = 100;
        this.activeComp = '';
        this.activeCompNum = 0;
        this.deactiveCompNum = 0;
        this.curHorde = '';
        this.curBill = [];
        this.levelCompArr = [];
        this.score = 0;
    }

    preload()
    {
        super.preload();
        // Load sounds
        this.load.audio("winding", "sounds/win31.mp3");

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
        this.add.text(10, game.config.height - 50, 'Bill:%d/%d  System:%d/%d/%d  Level:' + this.curLevel.toString() + '  Score:' + this.score, style);
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
                    tmpOS = this.add.sprite(-this.OSOFFSETX, -this.OSOFFSETY, "apple")
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "bsdcpu":
                    tmpOS = this.add.sprite(-this.OSOFFSETX, -this.OSOFFSETY, "bsd");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "nextcpu":
                    tmpOS = this.add.sprite(-this.OSOFFSETX, -this.OSOFFSETY, "next");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "palmcpu":
                    tmpOS = this.add.sprite(-this.OSOFFSETX, -this.OSOFFSETY, "palm");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "sgicpu":
                    tmpOS = this.add.sprite(-this.OSOFFSETX, -this.OSOFFSETY, "sgi");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "suncpu":
                    tmpOS = this.add.sprite(-this.OSOFFSETX, -this.OSOFFSETY, "sun");
                    this.levelCompArr[i].add(tmpOS);
                    break;
                case "os2cpu":
                    var pcos = Phaser.Math.Between(6, this.os.length)
                    tmpOS = this.add.sprite(-this.OSOFFSETX, -this.OSOFFSETY, this.os[pcos]);
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

            let myLine =  new Phaser.Geom.Line(this.levelCompArr[tComp1ID].x, 
                this.levelCompArr[tComp1ID].y,
                this.levelCompArr[tComp2ID].x,
                this.levelCompArr[tComp2ID].y);
            /*
            this.add.path(myLine);
            var graphics = this.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });
            graphics.strokeLineShape(myLine);
            */
        }

        // Setup Bill horde
        // curMaxBills = Math.min((8 + 3 * curLevel) * Game_scale(2));
        // Original game tries to scale number of bills according to the game board dimensions
        let curMaxBills = Math.min((8 + 3 * this.curLevel) , this.MAXBILLS);
        for(let i = 0 ; i < curMaxBills; i++) {
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
            var tmpBill = this.add.sprite(0, 0, billImage).play(billAnim);
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
            this.curBill[i].on('pointerdown', function() {
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
                const index = this.curBill.indexOf(this);
                if (index > -1) {
                    this.curBill.splice(index, 1);
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
            // this.curBill[i].self.on('pointerdown', this.onBillClick, this);
        }

        game.config.offScreen = this.curBill.length;
        var timer = this.time.addEvent({
            delay: 200,                // ms
            callback: this.timerCallback,
            args: [game.config.offScreen],
            callbackScope: this,
            loop: true
        });

    }

    timerCallback(billsLeft) {
        if (this.game.config.offScreen > 0) {
            let launched = this.billLaunch(this.curLevel, this, billsLeft);
            this.game.config.offScreen = this.game.config.offScreen - launched;
        } else {
            console.log("No more Bills left!")
        }
    }

    update()
    {
        super.update();
        console.log(game.config.offScreen);
        /*
        if (offScreen > 0) {
            score += (level * efficiency / iteration);
        }
        */
    }

    billLaunch(level, t, billNum)
    {
        // Original xbill 2.1 formula
        var minBill = Math.min(2 + level / 4, 12);
        var n = Phaser.Math.Between(1, Math.min(minBill, billNum));
        console.log("Should release" + n + "Bills");
        for (;n>0;n--) {
            var myBill = Phaser.Utils.Array.GetRandom(this.curBill);
            // console.log(myBill.getData("ingame"));
            if (myBill == null || myBill.getData("ingame") == true || myBill.getData("dead") == true) {
                continue;
            }
            myBill.setData("ingame", "true");
            var myCPU = Phaser.Utils.Array.GetRandom(this.levelCompArr);
            // console.log(myBill);
            t.physics.moveToObject(myBill, myCPU, 100);
            t.physics.add.overlap(myBill, myCPU, t.replaceOS, null, t);
        }

        return n;
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
                return;
               //this.physics.moveTo(myBill, 100, 100);
            }

            myBill.removeAt(0);
            myCPU.removeAt(1);

            myBill.addAt(goodOS, 0);
            myCPU.addAt(wingdows, 1);

            goodOS.setPosition(0, -20);
            wingdows.setPosition(-this.OSOFFSETX, -this.OSOFFSETY);

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
        }
    }


    hordeSetup(t, curLevel)
    {
    }
}
