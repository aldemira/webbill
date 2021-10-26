const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    pixelArt: true,
    // Set this for game-over
    // backgroundColor: '#4488aa',
    physics: {
        default: 'arcade'
    },
    scene: [ gameMenu ],
    offScreen: 0
    };

let game = new Phaser.Game(config);
