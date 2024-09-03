import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Main } from "../../../main";
import { ColorGradientFilter, DropShadowFilter } from "pixi-filters";
import { Textstyles } from "../../styles/TextStyles";
import { Effects } from "../../styles/Effects";

export class HeaderPanel extends Container {
    private background: Sprite | null = null;
    private dropShadowFilter: DropShadowFilter;
    private betText: Text;

    constructor(betSize: number) {
        super();

        this.betText = new Text(`Bet: ${betSize}$`, Textstyles.BUTTON_TEXTSTYLE);

        this.setBackground()
            .then(this.setButtons.bind(this))
            .then(this.setBetText.bind(this))
            .then(this.setTextFrame.bind(this))

        Main.signalController.bet.updated.add(this.onBetUpdate, this);
        this.dropShadowFilter = new DropShadowFilter(Effects.HEADER_PANEL_DROP_SHADOW);

        this.filters = [this.dropShadowFilter];
    }

    private async setBackground() {
        this.background = await Main.assetsLoader.getSprite('header_panel');
        this.resize();
        this.addChild(this.background);
    }

    private setBetText() {
        this.betText.position.set(80, 80);
        this.addChild(this.betText);
    }

    private async setTextFrame() {
        const frame = new Graphics();
        frame.beginFill(0x000000)
            .lineStyle(1, 0xffffff, 0.2)
            .drawRoundedRect(0, 0, 150, 50, 5)
            .endFill();
        const texture = Main.APP.renderer.generateTexture(frame);
        const sprite = new Sprite(texture);
        sprite.filters = [new ColorGradientFilter({
            css: `linear-gradient(220deg, rgba(255,255,255,0.3) 0%, 
            rgba(255,255,255,0.1) 1%, rgba(0,0,0,0) 100%)`
        })]
        this.addChild(sprite)
    }

    private setButtons() {
        // this.clearBetButton.position.set(183, -155);
        // this.clearBetButton.scale.set(0.7);
        // this.addChild(this.clearBetButton);

        // this.placeBetButton.position.set(this.width-183,-65);
        // this.placeBetButton.scale.set(0.7);
        // this.addChild(this.placeBetButton);
    }

    private resize() {
        if (this.background === null) return;
        const bgRatio = this.background.height / this.background.width;

        this.background.width = Main.screenSize.width;
        this.background.height = this.background.width * bgRatio * 0.65;
    }

    private onResize() {
        this.resize();
    }


    private onBetUpdate(betSize: number) {
        this.betText.text = `Bet: ${betSize}$`;
    }
}