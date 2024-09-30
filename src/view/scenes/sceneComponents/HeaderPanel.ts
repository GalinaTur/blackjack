import { Container, Text } from "pixi.js";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { IPanel } from "../../../data/types";
import { Animations } from "../../styles/Animations";
import { HEADER_FIELDS } from "../../../data/constants";

export class HeaderPanel extends Container implements IPanel {
    private betText: Text;
    private balanceText: Text;
    private winText: Text;
    private totalWinText: Text;

    constructor(winSize: number, playerBalance: number, totalWin: number) {
        super();
        this.betText = new Text(`Bet: $`, Textstyles.HEADER_TEXTSTYLE);
        this.balanceText = new Text(`Balance: ${playerBalance}$`, Textstyles.HEADER_TEXTSTYLE);
        this.winText = new Text(`Win: ${winSize}$`, Textstyles.HEADER_TEXTSTYLE);
        this.totalWinText = new Text(`Total Win: ${totalWin}$`, Textstyles.HEADER_TEXTSTYLE);
        this.init();
    }

    protected async init() {
        this.setEventListeners();
        this.setTexts();
    }

    private setEventListeners() {
        Main.signalController.balance.updated.add(this.onBalanceUpdate, this);
        Main.signalController.winSize.updated.add(this.onWinSizeUpdate, this);
    }

    private setTexts() {
        this.totalWinText.anchor.set(0);
        this.totalWinText.position.x = Main.screenSize.width * 0.1;

        this.winText.anchor.set(0, 0);
        this.winText.position.x = Main.screenSize.width * 0.3;

        this.balanceText.anchor.set(0, 0);
        this.balanceText.position.x = Main.screenSize.width * 0.5;

        this.betText.anchor.set(0, 0);
        this.betText.position.x = Main.screenSize.width * 0.8;

        this.addChild(this.totalWinText, this.winText, this.balanceText, this.betText);
    }

    private createText(name: string, value: string): string {
        return `${name}: ${value}$`;
    }

    public onBetUpdate(betSize: number) {
        Animations.headerText.update(this.betText, HEADER_FIELDS.bet, betSize, this.createText);
    }

    private onBalanceUpdate(balance: number) {
        Animations.headerText.update(this.balanceText, HEADER_FIELDS.balance, balance, this.createText);
    }


    private onWinSizeUpdate(obj: { win: number, totalWin: number }) {
        const { win, totalWin } = obj;
        Animations.headerText.update(this.winText, HEADER_FIELDS.win, win, this.createText);
        Animations.headerText.update(this.totalWinText, HEADER_FIELDS.totalWin, totalWin, this.createText);
    }

    public deactivate(): void {
        Main.signalController.balance.updated.remove(this.onBalanceUpdate);
        Main.signalController.winSize.updated.remove(this.onWinSizeUpdate);
    }

    public onResize() {
        this.totalWinText.position.x = Main.screenSize.width * 0.1;
        this.winText.position.x = Main.screenSize.width * 0.3;
        this.balanceText.position.x = Main.screenSize.width * 0.5;
        this.betText.position.x = Main.screenSize.width * 0.8;
    }
}