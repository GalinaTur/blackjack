import { Container, Sprite, Text } from "pixi.js";
import { BevelFilter, DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Effects } from "../../styles/Effects";
import { TBets } from "../../../data/types";

export class ChipView extends Container {
    public value: TBets;
    private image: Sprite | null = null;
    private chipName: string = '';
    private text: Text | null = null;
    public dropShadowFilter: DropShadowFilter;
    public hidden = false;

    public bevelFilter: BevelFilter;
    private bevelFilterOptions = {
        rotation: 280,
        thickness: 1,
    }

    constructor(name: string, value: TBets, onClick: (() => void)) {
        super();
        this.chipName = name;
        this.value = value;
        this.setSprite(this.chipName)

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
        this.addChild(this.image);
    }

    public onResize() {

    }
}