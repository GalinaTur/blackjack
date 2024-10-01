import { Graphics, Sprite, Text } from "pixi.js";
import { Main } from "../../../../main";
import { Textstyles } from "../../../styles/TextStyles";
import { IButton } from "../../../../data/types";
import { Animations } from "../../../styles/Animations";
import { Button } from "./Button";
import { SOUNDS } from "../../../../data/constants";

export class GameButton extends Button {

    constructor(buttonInfo: IButton, onClick: (() => void), private _isActive: boolean) {
        super(buttonInfo.imgID);
        this.setTextFrame(buttonInfo.text);
        this.on('pointerdown', () => {
            this.playSound(SOUNDS.button);
            onClick();
        });

        if (!this._isActive) {
            this.scale.set(0);
            this.disable();
        }
    }

    private setTextFrame(data: string): void {
        if (!data) return;
        const frame = new Graphics()
            .beginFill(0x000000)
            .lineStyle(3, 0xffffff, 1)
            .drawRoundedRect(0, 0, 100, 22, 5)
            .endFill();
        const texture = Main.APP.renderer.generateTexture(frame);
        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.position.set(0, 40);
        const text = this.createText(data);
        sprite.addChild(text);
        this.addChild(sprite);
    }

    private createText(data: string): Text {
        const text = new Text(data.toUpperCase(), Textstyles.BUTTON_TEXTSTYLE);
        text.anchor.set(0.5);
        return text;
    }

    private enable(): void {
        Animations.button.enable(this);
        this.eventMode = "static";
        this.cursor = "pointer";
        this.onPointerOut();
    }

    private async disable(): Promise<void> {
        this.eventMode = "none";
        this.cursor = "default";
        await Animations.button.disable(this);
    }

    public async updateIsActive(isActive: boolean): Promise<void> {
        if (this._isActive === isActive) return;
        this._isActive = isActive;
        this._isActive ? this.enable() : await this.disable();
    }

    private async playSound(soundID: string) {
        const sound = await Main.assetsController.getSound(soundID);
        sound.play();
    }

    get isActive() {
        return this._isActive;
    }
}