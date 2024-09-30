import { Container, Sprite } from "pixi.js";
import { BevelFilter, DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Effects } from "../../styles/Effects";
import { EChips, TBets } from "../../../data/types";

export class ChipView extends Container {
    public value: TBets;
    private image: Sprite | null = null;
    public dropShadowFilter: DropShadowFilter;
    public hidden = false;

    public bevelFilter: BevelFilter;
    private bevelFilterOptions = {
        rotation: 280,
        thickness: 1,
    }

    constructor(value: TBets, onClick?: (() => void)) {
        super();
        this.value = value;


        onClick && this.on('pointerdown', onClick);

        this.dropShadowFilter = new DropShadowFilter(Effects.CHIP_DROP_SHADOW);
        this.bevelFilter = new BevelFilter(this.bevelFilterOptions);

        this.init();
    }

    private async init() {
        await this.setSprite()
        this.eventMode = "static";
        this.cursor = "pointer";
        this.filters = [this.dropShadowFilter, this.bevelFilter];
    }

    private async setSprite() {
        const key: string = this.value + '$';
        const name = EChips[key as keyof typeof EChips];
        this.image = await Main.assetsController.getSprite(name);
        this.image.anchor.set(0.5);
        this.image.scale.set(0.7)
        this.addChild(this.image);
    }

    public onResize() {

    }
}