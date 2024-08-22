import { Container, Sprite } from "pixi.js";
import { AssetsLoader } from "../../../controller/AssetsController";
import { Main } from "../../../main";
import { Button } from "./Button";


export class BetPanel extends Container {
    image: Sprite | null = null;
    clearBetButton: Button;
    placeBetButton: Button;

    constructor() {
        super();
        this.clearBetButton = new Button('Clear Bet', this.onClearBet);
        this.placeBetButton = new Button('Place Bet', this.onPlaceBet);

        this.setSprite()
        .then(this.setButtons.bind(this));
    }

    async setSprite() {
        this.image = await AssetsLoader.getSprite('bet_panel');
        this.image.anchor.y = 1
        this.resize();
        this.addChild(this.image);
    }

    setButtons() {
        console.log(this.x, this.y);
        this.clearBetButton.position.set(180, -150);
        this.clearBetButton.scale.set(0.6);
        this.addChild(this.clearBetButton);

        this.placeBetButton.position.set(this.width-180,-70);
        this.placeBetButton.scale.set(0.6);
        this.addChild(this.placeBetButton);
    }

    resize() {
        if (this.image === null) return;
        const bgRatio = this.image.height / this.image.width;

        this.image.width = Main.screenSize.width;
        this.image.height = this.image.width*bgRatio*0.6;
    }

    onResize() {
        this.resize();
    }

    onClearBet() {

    }

    onPlaceBet() {

    }
}