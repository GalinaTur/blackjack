import { Container, Sprite } from "pixi.js";
import { CardModel } from "../../../model/CardModel";
import { DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Effects } from "../../styles/Effects";
import { Animations } from "../../styles/Animations";

export class CardView extends Container {

    private _image: Sprite | null = null;
    private _backImage: Sprite | null = null;
    public dropShadowFilter: DropShadowFilter;
    public value: string = '';

    constructor(private card: CardModel) {
        super();
        this.value = card.value;
        this.setImage();
        this.dropShadowFilter = new DropShadowFilter(Effects.CARD_DROP_SHADOW);
        this.filters = [this.dropShadowFilter];
    }

    private setImage() {
        this._backImage = Main.assetsController.getSprite('card_back');
        this._image = Main.assetsController.getSprite(this.value);
        this._backImage.anchor.set(0.5)
        this._image.anchor.set(0.5);
        this.addChild(this._backImage);
        this._image.scale.x = 0;
        this.addChild(this._image);
    }

    public open() {
        if (this.card.hidden) {
            return;
        }

        if (!this._backImage || !this._image) {
            return;
        }
        
        this._backImage.scale.x = 0;
        this._image.scale.x = this._image.scale.y;
    }

    public async animatedOpen() {
        if (this.card.hidden) {
            return;
        }
        await Animations.cards.open(this);
    }

    get image() {
        if (this.card.hidden) {
            return;
        }
        return this._image;
    }

    get backImage() {
        return this._backImage;
    }
}