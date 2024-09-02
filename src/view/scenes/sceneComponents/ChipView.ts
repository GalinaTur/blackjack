import { Container, Rectangle, Sprite, Text, TextStyle } from "pixi.js";
import { BevelFilter, DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";

export class Chip extends Container {
    image: Sprite | null = null;
    text: Text | null = null;
    dropShadowFilter: DropShadowFilter;
    dropShadowFilterOptions = {
        blur: 3,
        quality: 3,
        alpha: 1,
        offset: {
            x: 5,
            y: -5,
        },
        color: 0x000000
    }
    bevelFilter: BevelFilter;
    bevelFilterOptions = {
        rotation: 280,
        thickness: 3
    }

    constructor(name: string, value: string, onClick: (() => void)) {
        super();
        this.setSprite(name)
            .then(this.setText.bind(this, value));
        this.eventMode = "static";
        this.cursor = "pointer";
        // this.sepiaColorFilter = new ColorMatrixFilter();
        // this.sepiaColorFilter.sepia(true);
        // this.filters = [this.sepiaColorFilter];

        this.on('pointerdown', onClick);

        this.dropShadowFilter = new DropShadowFilter(this.dropShadowFilterOptions);
        this.bevelFilter = new BevelFilter(this.bevelFilterOptions);

        this.filters = [this.dropShadowFilter, this.bevelFilter];
    }

    async setSprite(name: string) {
        this.image = await Main.assetsLoader.getSprite(`${name}.png`);
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
}