class wmaker
{
    constructor(context)
    {
        this.context = context;
    }

    createXWindow(x, y, windowWidth, windowHeight, windowText)
    {
        // pulled of from windowmaker.org
        let lightBorder = 0xb6b6b6;
        let darkBorder = 0x616161;
        let black = 0x000000;
        let white = 0xffffff;

        let myContainer = this.context.add.container(x, y)
            .setSize(windowWidth, windowHeight)
            .setDepth(4);

        let myTitle = this.context.add.graphics()
            .lineStyle(1, lightBorder, 1)
            .fillStyle(black);

        myTitle.fillRect(0, 0, windowWidth, 20);

        let myLine = new Phaser.Geom.Line(0, 0, 0, 20);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(0, 0, 20, 0);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(21, 0, 21, 20);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(21, 0, windowWidth - 21, 0);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(windowWidth - 20, 0, windowWidth - 20, 20);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(windowWidth - 20, 0, windowWidth, 0);
        myTitle.strokeLineShape(myLine);

        myTitle.lineStyle(1, darkBorder, 1);
        myLine = new Phaser.Geom.Line(0, 20, 20, 20);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(20, 0, 20, 20);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(21, 20, windowWidth - 21, 20);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(windowWidth - 21, 0, windowWidth - 21, 20);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(windowWidth - 21, 20, windowWidth, 20);
        myTitle.strokeLineShape(myLine);
        myLine = new Phaser.Geom.Line(windowWidth, 0, windowWidth, 20);
        myTitle.strokeLineShape(myLine);

        myContainer.add(myTitle);

        let myWindow = this.context.add.graphics()
            .lineStyle(1, black, 1)
            .fillStyle(white);

        myWindow.fillRect(0, 21, windowWidth, windowHeight);
        myWindow.strokeRect(0, 21, windowWidth, windowHeight);
        myContainer.add(myWindow);

        let minimize = this.context.add.image(10,10,'minimize')
            .setOrigin(0.5);
        myContainer.add(minimize);
        let close = this.context.add.image(windowWidth - 10, 10, 'close')
            .setOrigin(0.5);
        myContainer.add(close);

        const textStyle = { fontFamily: "Menlo Regular", fill: "#fff", fontSize: "10px" };
        let myText = this.context.add.text(windowWidth / 2, 10, windowText, textStyle)
            .setOrigin(0.5);
        myContainer.add(myText);

        this.windowContainer = myContainer;
    }
}
