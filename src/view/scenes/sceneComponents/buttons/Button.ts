import { ColorMatrixFilter, Container, Filter, Sprite } from "pixi.js";
import { Main } from "../../../../main";

export class Button extends Container {
    protected image: Sprite | null = null;
    private colorMatrixFilter = new ColorMatrixFilter();
    public filters: Filter[] = [];

    constructor(imgID: string) {
        super();
        this.setImage(imgID);
        this.init();
    }

    private init(): void {
        this.eventMode = "static";
        this.cursor = "pointer";
        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);
    }

    protected setImage(imgID: string): void {
        this.image = Main.assetsController.getSprite(imgID);
        this.image.anchor.set(0.5);
        this.addChildAt(this.image, 0);
    }

    private onPointerOver(): void {
        this.colorMatrixFilter.brightness(1.2, false);
        this.filters.push(this.colorMatrixFilter);
    }

    protected onPointerOut(): void {
        this.colorMatrixFilter.brightness(1, false);
        this.filters = [this.colorMatrixFilter, ...this.filters.filter(f => f !== this.colorMatrixFilter)];
    }

    public deactivate() {
        this.off('pointerover', this.onPointerOver);
        this.off('pointerout', this.onPointerOut);
    }
}