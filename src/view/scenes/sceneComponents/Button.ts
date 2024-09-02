import { ColorMatrixFilter, Container, Filter, Sprite, Text } from "pixi.js";
import { DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";

export class Button extends Container {
    image: Sprite | null = null;
    text: Text | null = null;
    isActive: boolean;
    desaturateFilter: ColorMatrixFilter;
    dropShadowFilter: DropShadowFilter;
    dropShadowFilterOptions = {
        blur: 3,
        quality: 2,
        alpha: 0.5,
        offset: {
            x: 2,
            y: -2,
        },
        color: 0x000000,
    }
    filters: Filter[]  = [];

    constructor(buttonText: string | null, onClick: (() => void), isActive: boolean) {
        super();
        this.isActive = isActive;
        this.setSprite()
            .then(this.setText.bind(this, buttonText));
        this.eventMode = "static";
        this.cursor = "pointer";
        this.desaturateFilter = new ColorMatrixFilter();
        this.desaturateFilter.desaturate();

        this.on('pointerdown', onClick);

        this.dropShadowFilter = new DropShadowFilter(this.dropShadowFilterOptions);

        this.filters = [this.dropShadowFilter];

        if (!isActive) this.disable();
    }

    async setSprite() {
        this.image = await Main.assetsLoader.getSprite('button');
        this.image.anchor.set(0.5);
        this.setSize();
        this.addChild(this.image);
    }

    setText(data: string | null) {
        if (!data) return
        if (!this.image) return;

        this.text = new Text(data, Textstyles.BUTTON_TEXTSTYLE);
        this.text.anchor.set(0.5);
        this.addChild(this.text);
    }

    async setSize() {
        if (this.image === null) return;
        const buttonRatio = this.image.height / this.image.width;

        // this.image.width = Main.screenSize.width * 0.1;
        // this.image.height = this.image.width * buttonRatio;
    }

    enable() {
        this.filters = this.filters.filter(f => {
            return f !== this.desaturateFilter;
        })
        this.eventMode = "static";
        this.cursor = "pointer";
    }

    disable() {
        this.filters.push(this.desaturateFilter);
        this.eventMode = "none";
        this.cursor = "default";
    }

    update(isActive: boolean) {
        if (this.isActive === isActive) return;
        this.isActive = isActive;
        this.isActive ? this.enable() : this.disable();
    }

}