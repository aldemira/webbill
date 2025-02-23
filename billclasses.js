class billDies extends Phaser.GameObjects.Sprite{
    constructor(scene,x,y){
            super(scene,x,y,"explosive");
            scene.add.existing(this);
            this.play("billDAnim");
            this.once('animationcomplete', () => {
                this.destroy();
            });
        }
}
