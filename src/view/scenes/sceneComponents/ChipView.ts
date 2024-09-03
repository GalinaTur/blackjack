import { Container, Rectangle, Sprite, Text } from "pixi.js";
import { BevelFilter, DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Effects } from "../../styles/Effects";

export class Chip extends Container {
    private image: Sprite | null = null;
    private text: Text | null = null;
    private dropShadowFilter: DropShadowFilter;

    private bevelFilter: BevelFilter;
    private bevelFilterOptions = {
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

        this.dropShadowFilter = new DropShadowFilter(Effects.CHIP_DROP_SHADOW);
        this.bevelFilter = new BevelFilter(this.bevelFilterOptions);

        this.filters = [this.dropShadowFilter, this.bevelFilter];
    }

    private async setSprite(name: string) {
        this.image = await Main.assetsLoader.getSprite(`${name}.png`);
        this.image.anchor.set(0.5);
        this.setSize();
        this.addChild(this.image);
    }

    private setText(data: string | null) {
        if (!data) return
        if (!this.image) return;

        this.text = new Text(data, Textstyles.BUTTON_TEXTSTYLE);
        this.text.anchor.set(0.5);
        this.addChild(this.text);
    }

    private async setSize() {
        if (this.image === null) return;
        const buttonRatio = this.image.height / this.image.width;

        // this.image.width = Main.screenSize.width * 0.1;
        // this.image.height = this.image.width * buttonRatio;
    }
}