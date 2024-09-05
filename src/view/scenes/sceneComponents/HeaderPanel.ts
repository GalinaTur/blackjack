import { Graphics, Sprite, Text } from "pixi.js";
import { Main } from "../../../main";
import { ColorGradientFilter } from "pixi-filters";
import { Textstyles } from "../../styles/TextStyles";
import { Effects } from "../../styles/Effects";
import { Panel } from "./Panel";
import { IPanel } from "../../../data/types";

export class HeaderPanel extends Panel implements IPanel {
    private betText: Text;
    private balanceText: Text;
    private winText: Text;
    private totalWinText: Text;

    constructor(betSize: number, winSize: number, playerBalance: number, totalWin: number) {
        super('header_panel');

        this.betText = new Text(`Bet: ${betSize}$`, Textstyles.HEADER_TEXTSTYLE);
        this.balanceText = new Text(`Balance: ${playerBalance}$`, Textstyles.HEADER_TEXTSTYLE);
        this.winText = new Text(`Win: ${winSize}$`, Textstyles.HEADER_TEXTSTYLE);
        this.totalWinText = new Text(`Total Win: ${totalWin}$`, Textstyles.HEADER_TEXTSTYLE);
        this.dropShadowFilter.offset.y = Effects.HEADER_PANEL_DROP_SHADOW.offset.y

        this.init();
    }

    protected async init() {
        await super.init();
        this.setButtons();
        this.setLeftTextFrame();
        this.setRightTextFrame();
        this.background?.anchor.set(0);
        this.setEventListeners();
    }

    private setEventListeners() {
        Main.signalController.bet.updated.add(this.onBetUpdate, this);
        Main.signalController.balance.updated.add(this.onBalanceUpdate, this);
        Main.signalController.winSize.updated.add(this.onWinSizeUpdate, this);
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



    private onBetUpdate(betSize: number) {
        this.betText.text = `Bet: ${betSize}$`;
    }

    private onBalanceUpdate(balance: number) {
        this.balanceText.text = `Balance: ${balance}$`
    }


    private onWinSizeUpdate(obj: { win: number, totalWin: number }) {
        const { win, totalWin } = obj;
        this.winText.text = `Win: ${win}$`
        this.totalWinText.text = `Total Win: ${totalWin}$`
    }

    // private onResize() {
    //     this.resize();
    // }
}