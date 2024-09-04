import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Main } from "../../../main";
import { ColorGradientFilter, DropShadowFilter } from "pixi-filters";
import { Textstyles } from "../../styles/TextStyles";
import { Effects } from "../../styles/Effects";

export class HeaderPanel extends Container {
    private background: Sprite | null = null;
    private dropShadowFilter: DropShadowFilter;
    private betText: Text;
    private balanceText: Text;
    private winText: Text;
    private totalWinText: Text;

    constructor(betSize: number, winSize: number, playerBalance: number, totalWin: number) {
        super();

        this.betText = new Text(`Bet: ${betSize}$`, Textstyles.HEADER_TEXTSTYLE);
        this.balanceText = new Text(`Balance: ${playerBalance}$`, Textstyles.HEADER_TEXTSTYLE);
        this.winText = new Text(`Win: ${winSize}$`, Textstyles.HEADER_TEXTSTYLE);
        this.totalWinText = new Text(`Total Win: ${totalWin}$`, Textstyles.HEADER_TEXTSTYLE);

        this.setBackground()
            .then(this.setButtons.bind(this))
            .then(this.setLeftTextFrame.bind(this))
            .then(this.setRightTextFrame.bind(this));

        Main.signalController.bet.updated.add(this.onBetUpdate, this);
        this.dropShadowFilter = new DropShadowFilter(Effects.HEADER_PANEL_DROP_SHADOW);

        this.filters = [this.dropShadowFilter];
    }

    private async setBackground() {
        this.background = await Main.assetsLoader.getSprite('header_panel');
        this.resize();
        this.addChild(this.background);
    }

    private setLeftTextFrame() {
        const frame = this.setTextFrame();
        this.totalWinText.anchor.set(0, 0);
        this.winText.anchor.set(0, 0);
        this.totalWinText.position.set(5, 0);
        this.winText.position.set(5, 30);
        frame.addChild(this.totalWinText, this.winText);
        frame.position.set(10, 40);
        this.addChild(frame);
    }

    private setRightTextFrame() {
        const frame = this.setTextFrame();
        this.balanceText.anchor.set(0, 0);
        this.betText.anchor.set(0, 0);
        this.balanceText.position.set(5, 0);
        this.betText.position.set(5, 30);
        frame.addChild(this.balanceText, this.betText);
        frame.position.set(1100, 40);
        this.addChild(frame);
    }

    private setTextFrame() {
        const frame = new Graphics();
        frame.beginFill(0x000000)
            .lineStyle(1, 0xffffff, 0.2)
            .drawRoundedRect(0, 0, 400, 60, 5)
            .endFill();
        const texture = Main.APP.renderer.generateTexture(frame);
        const sprite = new Sprite(texture);
        sprite.filters = [new ColorGradientFilter({
            css: `linear-gradient(220deg, rgba(255,255,255,0.2) 0%, 
            rgba(255,255,255,0.05) 1%, rgba(0,0,0,0) 100%)`
        })]
        sprite.anchor.set(0, 0);
        return sprite;
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