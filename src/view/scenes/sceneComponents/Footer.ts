import { Container, Graphics, Sprite, Text } from "pixi.js";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { DropShadowFilter } from "pixi-filters";
import { Effects } from "../../styles/Effects";
import { SoundsButton } from "./buttons/SoundsButton";

export class Footer extends Container {
    private text: Text | null = null;
    private dropShadowFilter = new DropShadowFilter(Effects.FOOTER_DROP_SHADOW);
    private background: Sprite | null = null;
    private soundsOn: boolean;

    constructor(soundsOn: boolean) {
        super()
        this.text = new Text("", Textstyles.FOOTER_TEXTSTYLE);
        this.background;
        this.soundsOn = soundsOn
        this.init();
    }

    init() {
        this.setBackground();
        this.setSignature();
        this.setText();
        this.setSoundsButton();
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

    private setSoundsButton(){
        const soundsButton = new SoundsButton(this.soundsOn);
        soundsButton.scale.set(0.1);
        soundsButton.position.set(Main.screenSize.width*0.9, this.height/2);
        this.addChild(soundsButton);
    }

    private setText() {
        if (!this.text) return
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

    public updateText(message: string) {
        if (!this.text) return;
        this.text.text = message;
    }

    public onResize() {
        if (!this.background) return;
        if (!this.text) return;
        this.background.width = Main.screenSize.width;
        this.background.height = Main.screenSize.height*0.05;
        this.text.position.x = Main.screenSize.width*0.5;
        this.position.set(0, Main.screenSize.height - this.height);
    }
}