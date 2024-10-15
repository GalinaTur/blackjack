import { Point } from "pixi.js";
import { BevelFilter, DropShadowFilter } from "pixi-filters";
import { Effects } from "../../../styles/Effects";
import { EChips, IChip, TBets } from "../../../../data/types";
import { Button } from "./Button";
import { ChipView } from "../ChipView";

export class ChipButton extends Button implements IChip {
    public dropShadowFilter: DropShadowFilter;
    public isActive = true;

    public bevelFilter: BevelFilter;
    private bevelFilterOptions = {
        rotation: 280,
        thickness: 1,
    }

    constructor(public value: TBets, onClick: (() => void)) {

        const key: string = value + '$';
        const imgID = EChips[key as keyof typeof EChips];
        super(imgID)

        this.on('pointerdown', onClick);

        this.dropShadowFilter = new DropShadowFilter(Effects.CHIP_DROP_SHADOW);
        this.bevelFilter = new BevelFilter(this.bevelFilterOptions);
        this.filters = [this.dropShadowFilter, this.bevelFilter];

        this.scale.set(0.7)
    }

    public clone() {
        if (!this.image) {
            return null;
        }

        const chip = new ChipView(this.value);
        
        if (!chip.image) {
            return null;
        }

        chip.image.anchor.x = this.image?.anchor.x;
        chip.image.anchor.y = this.image?.anchor.y;
        chip.position = this.toGlobal(new Point(chip.x, chip.y));
        return chip;
    }

    public onResize() {

    }

    public deactivate(): void {
        super.deactivate();
        this.removeAllListeners();
    }
}