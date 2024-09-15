import { ColorMatrixFilter, Container, Filter, Graphics, Sprite, Text } from "pixi.js";
import { ColorOverlayFilter, DropShadowFilter, GlowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Effects } from "../../styles/Effects";
import { IButton } from "../../../data/types";
import { Animations } from "../../styles/Animations";

export class Button extends Container {
    private image: Sprite | null = null;
    private text: Text | null = null;
    private _isActive: boolean;
    private colorMatrixFilter: ColorMatrixFilter;
    private dropShadowFilter: DropShadowFilter;
    private glowFilter: GlowFilter
    public filters: Filter[] = [];

    constructor(buttonInfo: IButton, onClick: (() => void), isActive: boolean) {
        super();
        this._isActive = isActive;
        this.on('pointerdown', () => {
            onClick()
        });
        this.on('pointerover', this.onPointerOver);
        this.on('pointerout', this.onPointerOut);
        this.colorMatrixFilter = new ColorMatrixFilter();
        this.dropShadowFilter = new DropShadowFilter(Effects.BUTTON_DROP_SHADOW);
        this.glowFilter = new GlowFilter({ distance: 20, innerStrength: 5, outerStrength: 0, color: 0xffffff, alpha: 0.01 });
        this.init();
        this.setImage(buttonInfo.imgID)
            .then(this.setText.bind(this, buttonInfo.text));
    }

    private init() {
        this.eventMode = "static";
        this.cursor = "pointer";
        this.filters = [this.dropShadowFilter];
        this.colorMatrixFilter.desaturate();
        if (!this._isActive) {
            this.scale.set(0);
            this.disable();
        }
    }

    private async setImage(imgID: string) {
        this.image = await Main.assetsLoader.getSprite(imgID);
        this.image.anchor.set(0.5);
        // this.setSize();
        // this.scale.set(0.3)
        this.addChild(this.image);
    }

    private setText(data: string | null) {
        if (!data) return
        const frame = new Graphics().beginFill(0x000000)
            .lineStyle(3, 0xffffff, 1)
            .drawRoundedRect(0, 0, 100, 22, 5)
            .endFill();
        const texture = Main.APP.renderer.generateTexture(frame);
        const sprite = new Sprite(texture)
        sprite.anchor.set(0.5, 0.5);
        sprite.position.set(0, 40)
        this.text = new Text(data.toUpperCase(), Textstyles.BUTTON_TEXTSTYLE);
        this.text.anchor.set(0.5, 0.5);
        sprite.addChild(this.text);;
        this.addChild(sprite);
    }

    // async setSize() {
    //     if (this.background === null) return;
    //     const buttonRatio = this.background.height / this.background.width;
    // }

    private async onPointerOver() {
        this.colorMatrixFilter.brightness(1.2, false);
        this.filters.push(this.colorMatrixFilter)
    }

    private onPointerOut() {
        this.colorMatrixFilter.brightness(1, false);
        this.filters = [this.colorMatrixFilter, ...this.filters.filter(f => f !== this.colorMatrixFilter)];
    }

    private enable() {
        Animations.button.enable(this);
        this.eventMode = "static";
        this.cursor = "pointer";
        this.onPointerOut()
    }

    private disable() {
        Animations.button.disable(this);
        this.eventMode = "none";
        this.cursor = "default";
    }

    get isActive() {
        return this._isActive
    }

    public updateIsActive(isActive: boolean) {
        if (this._isActive === isActive) return;
        this._isActive = isActive;
        this._isActive ? this.enable() : this.disable();
    }
}