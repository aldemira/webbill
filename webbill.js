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
        scene: {
            preload: preload,
            create: create,
            update: update
        },
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
        // Load sprite sheet
        /*
          this.load.spritesheet("billA","images/webbillspriteA.png", {frameWidth: 58, frameHeight: 41});
          this.load.spritesheet("billD","images/webbillspriteD.png", {frameWidth: 24, frameHeight: 38});
          this.load.spritesheet("billRL","images/webbillspriteRL.png", {frameWidth: 58, frameHeight: 41});
          this.load.atlas("billL","images/webbillL.png","images/webbillL.json");
          this.load.atlas("billL","images/webbillL.png","images/webbillL.json");
          this.load.spritesheet("billR","/images/webbillspriteR.png", {frameWidth: 24, frameHeight: 38});
        */
        this.load.image("billL", "images/billL_0.png");
        this.load.image("billL2", "images/billL_2.png");
        this.load.image("billR", "images/billR_0.png");
        this.load.spritesheet("spark","images/sparksprite.png", {frameWidth: 20, frameHeight: 20});

        // Load animations

        /*
        this.anims.create({
            key: 'walkL',
            frames: this.anims.generateFrameNames('billL', 
                { 
                    prefix: "billL_",
                    suffix: ".png",
                    start: 0,
                    end: 2
                }),
            frameRate: 3,
            repeat: -1
        });
        */

    }

    function create ()
    {
        // Create Computers and Networks
        var levelCompArr = [];
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
        var curBill = [];
         // curMaxBills = Math.min((8 + 3 * curLevel) * Game_scale(2));
         // Original game tries to scale number of bills according to the game board dimensions
        var curMaxBills = Math.min((8 + 3 * curLevel) , MAXBILLS);
        for(var i = 0 ; i < curMaxBills; i++) {
            // 0 add bill just behind the x axis
            // 1 add bill just behind the y axis
            xory = Phaser.Math.Between(0,1);
            var randComp = Phaser.Math.Between(0, computers.length);
            var tempBody = "";
            var tmpBill = "";
            var tmpWin = this.add.sprite(0, -20, 'wingdows');
            if (xory == 0) {
                var billStartPoint = Phaser.Math.Between(game.config.height * 0.1, game.config.height * 0.9);
                var tmpBill = this.add.sprite(0, 0, 'billR');
                curBill[i] = this.add.container(-30, billStartPoint, [tmpBill, tmpWin]);
                curBill[i].setDepth(23);
            } else {
                var billStartPoint = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
                if ( billStartPoint >= game.config.width / 2 ) {
                    var billImage = 'billL';
                } else {
                    var billImage = 'billR';
                }
                var tmpBill = this.add.sprite(0, 0, billImage);
                curBill[i] = this.add.container(billStartPoint, -30, [tmpBill, tmpWin]);
                curBill[i].setDepth(23);
            }

            curBill[i].setSize(28, 42);
            curBill[i].setInteractive();
            this.physics.world.enable(curBill[i]);
            // curBill[i].self.on('pointerdown', this.onBillClick, this);
        }

        var i = Phaser.Math.Between(0, curBill.length);
        var k = Phaser.Math.Between(0, levelCompArr.length);
        this.physics.moveToObject(curBill[i], levelCompArr[k], 100);
        var billCollider = this.physics.add.overlap(curBill[i], levelCompArr[k], replaceOS, null, this);
    }

    function update()
    {
    }

    function replaceOS(myBill, myCPU)
    {
        var touching = !myCPU.body.touching.none;
        var wasTouching = !myCPU.body.wasTouching.none;
        // Do not fire collision second time!
        if (touching && !wasTouching) {
            console.log("warning bill is replacing the OS!")

            myBill.body.stop();
            var wingdows = myBill.next;
            var goodOS = myCPU.next;

            myBill.removeAt(1);
            myCPU.removeAt(1);

            myBill.addAt(goodOS, 1);
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

