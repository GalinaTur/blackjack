import { Container, Rectangle, Sprite, Text } from "pixi.js";
import { BevelFilter, DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Effects } from "../../styles/Effects";

export class ChipView extends Container {
    private image: Sprite | null = null;
    private chipName: string = '';
    private text: Text | null = null;
    public dropShadowFilter: DropShadowFilter;

    public bevelFilter: BevelFilter;
    private bevelFilterOptions = {
        rotation: 280,
        thickness: 1,
    }

    constructor(name: string, value: number, onClick: (() => void)) {
        super();
        this.chipName = name;
        this.setSprite(this.chipName)
            .then(this.setText.bind(this, String(value)));

        this.on('pointerdown', onClick);

        this.dropShadowFilter = new DropShadowFilter(Effects.CHIP_DROP_SHADOW);
        this.bevelFilter = new BevelFilter(this.bevelFilterOptions);

        this.init();
    }

    private init() {
        this.eventMode = "static";
        this.cursor = "pointer";
        this.filters = [this.dropShadowFilter, this.bevelFilter];
    }

    private async setSprite(name: string) {
        this.image = await Main.assetsLoader.getSprite(name);
        this.image.anchor.set(0.5);
        this.scale.set(Main.screenSize.height / 1000);
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