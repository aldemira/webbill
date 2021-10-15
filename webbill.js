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
    var computers = ["maccpu","nextcpu","cgicpu","suncpu","palmcpu","os2cpu","bsdcpu"];
    var os = ["wingdows", "apple", "next", "sgi", "sun", "palm", "os2", "bsd", "redhat", "hurd"];
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
        this.load.spritesheet("wingdows", "images/wingdows.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("apple", "images/apple.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("next", "images/next.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("sgi", "images/sgi.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("sun", "images/sun.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("palm", "images/palm.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("bsd", "images/bsd.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("linux", "images/linux.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("redhat", "images/redhat.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("hurd", "images/hurd.png", {frameWidth: 28, frameHeight: 24})
        this.load.spritesheet("os2", "images/os2.png", {frameWidth: 28, frameHeight: 24})
        // Load sprite sheet
        this.load.spritesheet("billA","images/webbillspriteA.png", {frameWidth: 58, frameHeight: 41});
        this.load.spritesheet("billD","images/webbillspriteD.png", {frameWidth: 58, frameHeight: 41});
        this.load.spritesheet("billRL","images/webbillspriteRL.png", {frameWidth: 58, frameHeight: 41});
        this.load.spritesheet("spark","images/sparksprite.png", {frameWidth: 20, frameHeight: 20});

        // Load animations
        this.anims.create({
            key: 'pickupA',
            frames: this.anims.generateFrameNumbers('billA', { frames: [ 0, 1, 2, 3 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'walkL',
            frames: this.anims.generateFrameNumbers('billRL', { frames: [ 0, 1, 2 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'walkR',
            frames: this.anims.generateFrameNumbers('billRL', { frames: [ 3, 4, 5 ] }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'billDies',
            frames: this.anims.generateFrameNumbers("billD", {frames:[ 5, 0, 1, 2, 3, 4]}),
            frameRate: 8,
            repeat: -1
        })

    }

    function create ()
    {
        networkCreate(this, curLevel);
    }

    function update()
    {
    }

    function networkCreate(t, myLevel)
    {
        // Computers to draw, formula from xbill-2.1
        var curCompNum = Math.min(8 + myLevel, maxComputers);
        activeCompNum = curCompNum;
        deactiveCompNum = 0;
        var virtCanvasX = 0;
        var virtCanvasY = 0;
        var cpuIndex = 0;
        // Cables to draw, formula from xbill-2.1
        var curCableNum = Math.min(myLevel, curCompNum/2);
        var levelCompArr = [];
        // TODO make sure computers don't overlap
        for(var i = 0; i<curCompNum;i++) {
            cpuIndex = Math.floor(Math.random() * computers.length);
            virtCanvasX = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
            virtCanvasY = Phaser.Math.Between(game.config.height * 0.1, game.config.height * 0.9);
            levelCompArr.push(t.add.image(virtCanvasX,virtCanvasY,computers[cpuIndex]));
            var tmpSprite;
            // Also add these to a t.physics.group()
            switch (computers[cpuIndex]) {
                case "maccpu":
                    tmpSprite = t.physics.add.sprite(virtCanvasX - OSOFFSETX, virtCanvasY - OSOFFSETY, "apple");
                    tmpSprite.setDepth(20);
                    break;
                case "bsdcpu":
                    tmpSprite = t.physics.add.sprite(virtCanvasX - OSOFFSETX, virtCanvasY - OSOFFSETY, "bsd");
                    tmpSprite.setDepth(20);
                    break;
                case "nextcpu":
                    tmpSprite = t.physics.add.sprite(virtCanvasX - OSOFFSETX, virtCanvasY - OSOFFSETY, "next");
                    tmpSprite.setDepth(20);
                    break;
                case "palmcpu":
                    tmpSprite = t.physics.add.sprite(virtCanvasX - OSOFFSETX, virtCanvasY - OSOFFSETY, "palm");
                    tmpSprite.setDepth(20);
                    break;
                case "sgicpu":
                    tmpSprite = t.physics.add.sprite(virtCanvasX - OSOFFSETX, virtCanvasY - OSOFFSETY, "sgi");
                    tmpSprite.setDepth(20);
                    break;
                case "suncpu":
                    tmpSprite = t.physics.add.sprite(virtCanvasX - OSOFFSETX, virtCanvasY - OSOFFSETY, "sun");
                    tmpSprite.setDepth(20);
                    break;
                case "os2cpu":
                    pcos = Phaser.Math.Between(6,os.length)
                    tmpSprite = t.physics.add.sprite(virtCanvasX - OSOFFSETX, virtCanvasY - OSOFFSETY, pcos);
                    break;
            }
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
            var graphics = t.add.graphics({ lineStyle: { width: 3, color: 0xaa00aa } });
            graphics.strokeLineShape(myLine);
        }


    }

    function hordeSetup(t, curLevel)
    {
         // curMaxBills = Math.min((8 + 3 * curLevel) * Game_scale(2));
         // Original game tries to scale number of bills according to the game board dimensions
         curMaxBills = Math.min((8 + 3 * curLevel) , MAXBILLS);
         for(var i = 0 ; i < curMaxBills; i++) {
             // 0 add bill just behind the x axis
             // 1 add bill just behind the y axis
             xory = Phaser.Math.Between(0,1);
             var billStartPoint = Phaser.Math.Between(game.config.width * 0.1, game.config.width * 0.9);
             if (xory == 0) {
                 curBill[i] = t.physics.add.group({
                     key: 'billL',
                     setXY: { x: 10, y: billStartPoint }
                 });
             } else {
                 curBill[i] = t.physics.add.group({
                     key: 'billL',
                     setXY: { y: 10, x: billStartPoint }
                 });
             }
         }
    }

