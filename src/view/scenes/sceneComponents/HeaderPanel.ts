import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Main } from "../../../main";
import { ColorGradientFilter, DropShadowFilter } from "pixi-filters";
import { Textstyles } from "../../styles/TextStyles";

export class HeaderPanel extends Container {
    image: Sprite | null = null;
    dropShadowFilter: DropShadowFilter;
    dropShadowFilterOptions = {
        blur: 5,
        quality: 3,
        alpha: 0.5,
        offset: {
            x: 0,
            y: 10,
        },
        color: 0x000000
    };

    betText: Text;

    constructor(betSize: number) {
        super();

        this.betText = new Text(`Bet: ${betSize}$`, Textstyles.BUTTON_TEXTSTYLE);

        this.setSprite()
            .then(this.setButtons.bind(this))
            .then(this.setBetText.bind(this))
            .then(this.setTextFrame.bind(this))

        Main.signalController.bet.updated.add(this.onBetUpdate, this);
        this.dropShadowFilter = new DropShadowFilter(this.dropShadowFilterOptions);

        this.filters = [this.dropShadowFilter];
    }

    async setSprite() {
        this.image = await Main.assetsLoader.getSprite('header_panel');
        this.resize();
        this.addChild(this.image);
    }

    setBetText() {
        this.betText.position.set(80, 80);
        this.addChild(this.betText);
    }

    async setTextFrame() {
        const frame = new Graphics();
        frame.beginFill(0x000000)
        .lineStyle(1, 0xffffff, 0.2)
        .drawRoundedRect(0,0,150,50,5)
        .endFill();
        const texture = Main.APP.renderer.generateTexture(frame);
        const sprite = new Sprite(texture);
        sprite.filters = [new ColorGradientFilter({
            css: `linear-gradient(220deg, rgba(255,255,255,0.3) 0%, 
            rgba(255,255,255,0.1) 1%, rgba(0,0,0,0) 100%)`
        })]
        this.addChild(sprite)
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