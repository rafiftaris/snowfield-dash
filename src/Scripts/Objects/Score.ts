import * as Phaser from "phaser";

export default class MyText extends Phaser.GameObjects.Text {
    public value: integer;

    constructor(scene: Phaser.Scene, score: integer, style) {
        super(scene, 0, 10, score.toString(), style);

        this.value = score;

        scene.add.existing(this);
        scene.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
                this.incrementScore();
            }
        });

        this.depth = 11;
    }

    incrementScore(): void{
        this.value += 10;
        this.text = this.value.toString();
    }
}