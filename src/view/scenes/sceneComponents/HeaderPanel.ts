import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { AssetsLoader } from "../../../controller/AssetsController";
import { Main } from "../../../main";
import { Button } from "./Button";
import { Chip } from "./Chip";
import { DropShadowFilter } from "pixi-filters";

export class HeaderPanel extends Container {
    image: Sprite | null = null;
    dropShadowFilter: DropShadowFilter;
    betText: Text;

    constructor(betSize: number) {
        super();
        const textStyle = new TextStyle({
            fontSize: 36,
            fill: "#ffffff",
            fontFamily: "SairaBD",
            strokeThickness: 4,
        });

        this.betText = new Text(`Bet: ${betSize}$`, textStyle)

        this.setSprite()
            .then(this.setButtons.bind(this))
            .then(this.setBetText.bind(this));

        this.dropShadowFilter = new DropShadowFilter({
            blur: 5,
            quality: 3,
            alpha: 0.5,
            offset: {
                x: 0,
                y: 10,
            },
            color: 0x000000
        });

        Main.signalController.bet.updated.add(this.onBetUpdate, this);

        this.filters = [this.dropShadowFilter];
    }

    async setSprite() {
        this.image = await AssetsLoader.getSprite('header_panel');
        this.resize();
        this.addChild(this.image);
    }

    setBetText() {
        this.betText.position.set(80, 80);
        this.addChild(this.betText);
    }

    setButtons() {
        // this.clearBetButton.position.set(183, -155);
        // this.clearBetButton.scale.set(0.7);
        // this.addChild(this.clearBetButton);

        // this.placeBetButton.position.set(this.width-183,-65);
        // this.placeBetButton.scale.set(0.7);
        // this.addChild(this.placeBetButton);
    }

    resize() {
        if (this.image === null) return;
        const bgRatio = this.image.height / this.image.width;

        this.image.width = Main.screenSize.width;
        this.image.height = this.image.width * bgRatio * 0.65;
    }

    onResize() {
        this.resize();
    }


    onBetUpdate(betSize: number) {
        this.betText.text = `Bet: ${betSize}$`;
    }
}