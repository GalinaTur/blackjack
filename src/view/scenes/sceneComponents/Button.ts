import { ColorMatrixFilter, Container, Filter, Sprite, Text } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Effects } from "../../styles/Effects";

export class Button extends Container {
    private background: Sprite | null = null;
    private text: Text | null = null;
    private isActive: boolean;
    private desaturateFilter: ColorMatrixFilter;
    private dropShadowFilter: DropShadowFilter;
    public filters: Filter[] = [];

    constructor(buttonText: string | null, onClick: (() => void), isActive: boolean) {
        super();
        this.isActive = isActive;
        this.on('pointerdown', onClick);
        this.desaturateFilter = new ColorMatrixFilter();
        this.dropShadowFilter = new DropShadowFilter(Effects.BUTTON_DROP_SHADOW);
        this.init();
        this.setBackround()
            .then(this.setText.bind(this, buttonText));
    }

    private init() {
        this.eventMode = "static";
        this.cursor = "pointer";
        this.filters = [this.dropShadowFilter];
        this.desaturateFilter.desaturate();
        if (!this.isActive) this.disable();
    }

    private async setBackround() {
        this.background = await Main.assetsLoader.getSprite('button');
        this.background.anchor.set(0.5);
        // this.setSize();
        this.addChild(this.background);
    }

    private setText(data: string | null) {
        if (!data) return

        this.text = new Text(data, Textstyles.BUTTON_TEXTSTYLE);
        this.text.anchor.set(0.5);
        this.addChild(this.text);
    }

    // async setSize() {
    //     if (this.background === null) return;
    //     const buttonRatio = this.background.height / this.background.width;
    // }

    private enable() {
        this.filters = this.filters.filter(f => {
            return f !== this.desaturateFilter;
        })
        this.eventMode = "static";
        this.cursor = "pointer";
    }

    private disable() {
        this.filters.push(this.desaturateFilter);
        this.eventMode = "none";
        this.cursor = "default";
    }

    public updateIsActive(isActive: boolean) {
        if (this.isActive === isActive) return;
        this.isActive = isActive;
        this.isActive ? this.enable() : this.disable();
    }
}