import { Container, Point, Sprite } from "pixi.js";
import { BevelFilter, DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Effects } from "../../styles/Effects";
import { EChips, IChip, TBets } from "../../../data/types";

export class ChipView extends Container implements IChip{
    public image: Sprite | null = null;
    public dropShadowFilter: DropShadowFilter;
    public hidden = false;

    public bevelFilter: BevelFilter;
    private bevelFilterOptions = {
        rotation: 280,
        thickness: 1,
    }

    constructor(public value: TBets) {
        super();
        // this.image.anchor.set(0.5);
        // this.image.scale.set(0.7)

        this.dropShadowFilter = new DropShadowFilter(Effects.CHIP_DROP_SHADOW);
        this.bevelFilter = new BevelFilter(this.bevelFilterOptions);
        this.filters = [this.dropShadowFilter, this.bevelFilter];
    }

    private async setImage(): Promise<void> {
        const key: string = this.value + '$';
        const imgID = EChips[key as keyof typeof EChips];
        this.image = await Main.assetsController.getSprite(imgID);
        this.addChildAt(this.image, 0);
    }

    public static async build(value: TBets) {
        const chipView = new ChipView(value);
        await chipView.setImage();
        chipView.image?.anchor.set(0.5)
        chipView.image?.scale.set(0.7)
        return chipView;
    }

    public async clone(){
        if (!this.image) return null;
        const chip = await ChipView.build(this.value);
        if (!chip.image) return null;
        chip.image.anchor.x = this.image?.anchor.x;
        chip.image.anchor.y = this.image?.anchor.y;
        chip.position = this.toGlobal(new Point(chip.x, chip.y));
        return chip;
    }
    
    public onResize() {

    }
}