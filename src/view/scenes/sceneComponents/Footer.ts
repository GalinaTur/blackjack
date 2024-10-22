import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { DropShadowFilter } from "pixi-filters";
import { Effects } from "../../styles/Effects";
import { SoundsButton } from "./buttons/SoundsButton";
import { IRoundResult } from "../../../data/types";
import { Animations } from "../../styles/Animations";
import { InfoButton } from "./buttons/InfoButton";

export class Footer extends Container {
    private text: Text | null = null;
    private dropShadowFilter = new DropShadowFilter(Effects.FOOTER_DROP_SHADOW);
    private background: Sprite | null = null;

    constructor(private soundsOn: boolean) {
        super()
        this.text = new Text("", Textstyles.FOOTER_TEXTSTYLE);
        this.background;
        this.init();
    }

    init() {
        this.setBackground();
        this.setSignature();
        this.setText();
        this.setSoundsButton();
        this.setInfoButton();
        this.position.set(0, Main.screenSize.height - this.height);
        this.filters = [this.dropShadowFilter];
    }

    private setBackground() {
        const frame = new Graphics().beginFill(0x181818)
            .lineStyle(3, 0x000000, 1, 0)
            .drawRect(0, 0, Main.screenSize.width, 40)
            .endFill();
        const texture = Main.APP.renderer.generateTexture(frame);
        this.background = new Sprite(texture);
        this.addChild(this.background);
    }

    private setSoundsButton() {
        const soundsButton = new SoundsButton(this.soundsOn);
        soundsButton.scale.set(0.1);
        soundsButton.position.set(Main.screenSize.width * 0.9, this.height / 2);
        this.addChild(soundsButton);
    }

    private setInfoButton() {
        const infoButton = new InfoButton();
        infoButton.scale.set(0.1);
        infoButton.position.set(Main.screenSize.width * 0.93, this.height / 2);
        this.addChild(infoButton);
    }

    private setText() {
        if (!this.text) {
            return;
        }
        this.text.anchor.set(0.5);
        this.text.position.set(Main.screenSize.width * 0.5, this.height / 2);
        this.addChild(this.text);
    }

    private setSignature() {
        const text = new Text("H.T. 2024 Blackjack", Textstyles.FOOTER_SIGN_TEXTSTYLE);
        text.anchor.set(0, 0.5);
        text.position.set(Main.screenSize.width * 0.05, this.height / 2);
        this.addChild(text);
    }


    public setPlayerTurnText(isDoubleAllowed: boolean, isSplitAllowed: boolean) {
        let text = `HIT, STAND, DOUBLE or SPLIT this hand`;

        if (!isSplitAllowed) {
            text = `HIT, STAND or DOUBLE this hand`;
        }

        if (!isDoubleAllowed) {
            text = `Press HIT to receive another card or STAND to end this turn`;
        }

        this.updateText(text);
    }

    public setFinalText(result: IRoundResult, winSize: number) {
        let text: string;

        if (winSize > 0) {
            text = `You win ${winSize}$`;
            this.updateText(text);
            return;
        }

        switch (result.main) {
            case 'dealerBJ':
            case 'playerBust':
            case 'lose':
                text = `Dealer wins`;
                break;

            case 'push':
            case 'pushBJ':
                text = `Push`
                break;

            default: text = '';
        }
        this.updateText(text);
    }

    public async updateText(message: string) {
        if (!this.text) {
            return;
        }

        await Animations.footerText.hide(this.text);
        this.text.text = message;
        await Animations.footerText.show(this.text);
    }

    public onResize() {
        if (!this.background) {
            return;
        }

        if (!this.text) {
            return;
        }

        this.background.width = Main.screenSize.width;
        this.background.height = Main.screenSize.height * 0.05;
        this.text.position.x = Main.screenSize.width * 0.5;
        this.position.set(0, Main.screenSize.height - this.height);
    }

    public deactivate() {
        this.destroy();
    }
}