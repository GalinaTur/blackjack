import { Container, Sprite } from "pixi.js";
import { AssetsLoader } from "../../../controller/AssetsController";
import { Main } from "../../../main";
import { Button } from "./Button";
import { DropShadowFilter } from "pixi-filters";

export class GamePanel extends Container {
    image: Sprite | null = null;
    splitButton: Button;
    doubleButton: Button;
    hitButton: Button;
    standButton: Button;
    dropShadowFilter: DropShadowFilter;

    constructor() {
        super();
        this.splitButton = new Button('Split', this.onSplit);
        this.doubleButton = new Button('Double', this.onDouble);
        this.hitButton = new Button('Hit', this.onHit);
        this.standButton = new Button('Stand', this.onStand);
        this.dropShadowFilter = new DropShadowFilter({
            blur:5,
            quality: 3,
            alpha: 0.5,
            offset: {
                x: 0,
                y: -10,
            },
            color: 0x000000});

        this.setSprite()
        .then(this.setButtons.bind(this))

        this.filters = [this.dropShadowFilter];
    }

    async setSprite() {
        this.image = await AssetsLoader.getSprite('game_panel');
        this.image.anchor.y = 1
        this.resize();
        this.addChild(this.image);
    }

    setButtons() {
        this.splitButton.position.set(120, -50);
        this.splitButton.scale.set(0.7);
        this.addChild(this.splitButton);

        this.doubleButton.position.set(340,-50);
        this.doubleButton.scale.set(0.7);
        this.addChild(this.doubleButton);

        this.hitButton.position.set(560,-50);
        this.hitButton.scale.set(0.7);
        this.addChild(this.hitButton);

        this.standButton.position.set(780,-50);
        this.standButton.scale.set(0.7);
        this.addChild(this.standButton);
    }

    resize() {
        if (this.image === null) return;
        const bgRatio = this.image.height / this.image.width;

        this.image.width = Main.screenSize.width;
        this.image.height = this.image.width*bgRatio*0.65;
    }

    
    onHit() {
        Main.signalController.player.hit.emit();
    }
    
    onStand() {
        Main.signalController.player.stand.emit();
    }

    onDouble() {
        Main.signalController.player.double.emit();
    }

    onSplit() {
        Main.signalController.player.split.emit();
    }

    onResize() {
        this.resize();
    }
}