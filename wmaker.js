class wmaker
{
    constructor(context)
    {
        this.context = context;
    }

    // Creates a dismissible gui window
    createXWindow(x, y, windowWidth, windowHeight, windowText, hidden = false, depth = 4)
    {
        // pulled of from windowmaker.org
        let lightBorder = 0xb6b6b6;
        let darkBorder = 0x616161;
        let black = 0x000000;
        let white = 0xffffff;

        let myContainer = this.context.add.container(x, y)
            .setSize(windowWidth, windowHeight)
            .setDepth(depth);

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
            .setInteractive()
            .on('pointerdown', function() { myContainer.setVisible(false);} )
            .setOrigin(0.5);
        myContainer.add(close);

        const textStyle = { fontFamily: "Menlo Regular", fill: "#fff", fontSize: "10px" };
        let myText = this.context.add.text(windowWidth / 2, 10, windowText, textStyle)
            .setOrigin(0.5);
        myContainer.add(myText);

        myContainer.setVisible(!hidden);

        this.windowContainer = myContainer;
        return myContainer;
    }

/*
 * vrow => int, vertical row
 * hrow => int, horizontal row
 * icon => string, previously loaded image 
 * dockText => string, docker text to place under icon
 * callback => function, function to call on click
 */
    createDockButton(vrow, hrow, icon, dockText)
    {
        let dockBoxHeight = 64;
        let dockBoxWidth = 64;
        let shadowLineThickness = 3;
        let dockMainLineWidth = dockBoxWidth - shadowLineThickness;
        let dockMainLineHeight = dockBoxHeight - shadowLineThickness;
        let shadowLineAlpha = 0.5;
        let dockColour1 = 0xa6a6b6;
        let dockColour2 = 0x515561;
        let shadowWhite = 0xffffff;
        let shadowGrey = 0x333637;
        let shadowBlack = 0x000000;
        let iconPadding = 20;

        const iconBoxStyle = { fontFamily: "Menlo Regular", fontSize: 10, fill: "#000"};
        let alpha = 0.5 + ((0 / 10) * 0.5);
        // For simplicity let's have single line of column regardless
        hrow = 0;

        let myContainer = this.context.add.container((dockBoxWidth * hrow), dockBoxHeight * vrow)
            .setDataEnabled()
            .setSize(dockBoxWidth, dockBoxHeight)
            .setDepth(4);

        let myDockBox = this.context.add.graphics()
             .setDepth(1);

        let myTile = this.context.add.image(0, 0, 'tile')
            .setInteractive()
            .setOrigin(0)
            .setDisplaySize(dockBoxWidth, dockBoxHeight);
        myContainer.add(myTile);
        /*
        myDockBox.fillGradientStyle(dockColour1, dockColour2, dockColour2, dockColour2, 1);
        myDockBox.fillRect(0, 0, dockBoxWidth, dockBoxHeight);
        */
        myContainer.add(myDockBox);

        let iconX = dockBoxWidth - iconPadding;
        let iconY = dockBoxHeight - iconPadding;
        let myIcon = this.context.add.image(iconX / 1.5, iconY /1.5, icon)
            .setOrigin(0.5, 0.5)
            .setSize(iconX, iconY)
            .setDisplaySize(iconX, iconY);

        // muteSound() needs to access this global
        if (dockText == 'Volume') {
            this.context.volImg = myIcon;
        }
        myContainer.data.set('type', dockText);
        myContainer.add(myIcon);

        // Main dock icon has two filled triangles top righ and bottom left
        if (dockText == 'Main') {
            let myText = this.context.add.text(30, dockBoxHeight - 15, dockText, iconBoxStyle)
                .setDepth(4);
            myContainer.add(myText);
            myText = this.context.add.text(15, 5, '1', iconBoxStyle)
                .setDepth(4);
            myContainer.add(myText);


            // Diagonal lines, Mini triangles and their shadows
            shadowLineAlpha = 0.7;
            let lineThickness = 2;
            // diag bottom Left white shadow
            let myLine = new Phaser.Geom.Line(0, dockBoxHeight * 0.55 + 1, dockBoxWidth - (dockBoxWidth * 0.55) - 1, dockBoxHeight);
            myDockBox.lineStyle(lineThickness, shadowWhite, shadowLineAlpha)
                .strokeLineShape(myLine);

            // diag Top Right white shadow
            myLine = new Phaser.Geom.Line((dockBoxWidth * 0.55 ) - 1, 0, dockBoxWidth, dockBoxHeight - (dockBoxHeight * 0.55) + 1);
            myDockBox.lineStyle(lineThickness, shadowWhite, shadowLineAlpha)
                .strokeLineShape(myLine);

            lineThickness = 1;
            // diag Bottom left
            myLine = new Phaser.Geom.Line(0, dockBoxHeight * 0.55, dockBoxWidth - (dockBoxWidth * 0.55), dockBoxHeight);
            myDockBox.lineStyle(lineThickness, shadowBlack, shadowLineAlpha)
                .strokeLineShape(myLine);

            // diag Top Right
            myLine = new Phaser.Geom.Line(dockBoxWidth * 0.55, 0, dockBoxWidth, dockBoxHeight - (dockBoxHeight * 0.55));
            myDockBox.strokeLineShape(myLine);

            // Bottom Triangle
            myDockBox.fillStyle(shadowBlack, shadowLineAlpha)
                .fillTriangle(5, (dockBoxHeight * 0.55 ) + 12, 5, dockBoxHeight - 5, 5 + 12, dockBoxHeight - 5);

            // Top Triangle
            myDockBox.fillTriangle((dockBoxWidth * 0.55) + 12, 5, dockBoxWidth - 5, 5 , dockBoxWidth - 5,dockBoxHeight - (dockBoxHeight * 0.55) - 12);

            lineThickness = 2;
            // Bottom triangle white shadow
            myLine = new Phaser.Geom.Line(5, dockBoxHeight - 5,  5 + 12, dockBoxHeight - 5)
            myDockBox.lineStyle(lineThickness, shadowWhite, shadowLineAlpha)
                .strokeLineShape(myLine);

            // Top triangle white shadow
            myLine = new Phaser.Geom.Line(dockBoxWidth - 5, 5,  dockBoxWidth - 5, dockBoxHeight - (dockBoxHeight * 0.55) - 12);
            myDockBox.strokeLineShape(myLine);

        }

       return myContainer;
    }
}

export default wmaker;
