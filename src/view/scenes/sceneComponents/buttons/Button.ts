import { ColorMatrixFilter, Container, Filter, Sprite } from "pixi.js";
import { Main } from "../../../../main";
import { IButton } from "../../../../data/types";

export class Button extends Container {
    protected image: Sprite | null = null;
    private colorMatrixFilter = new ColorMatrixFilter();
    public filters: Filter[] = [];

    constructor(buttonInfo: IButton) {
        super();
        this.setImage(buttonInfo.imgID);
        this.init();
    }

    private init(): void {
        this.eventMode = "static";
        this.cursor = "pointer";
        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);
    }

    protected async setImage(imgID: string): Promise<void> {
        this.image = await Main.assetsLoader.getSprite(imgID);
        this.image.anchor.set(0.5);
        this.addChildAt(this.image, 0);
    }

    private async onPointerOver(): Promise<void> {
        this.colorMatrixFilter.brightness(1.2, false);
        this.filters.push(this.colorMatrixFilter);
    }

    protected onPointerOut(): void {
        this.colorMatrixFilter.brightness(1, false);
        this.filters = [this.colorMatrixFilter, ...this.filters.filter(f => f !== this.colorMatrixFilter)];
    }
}