import { Container, Sprite } from "pixi.js";
import { CardModel } from "../../../model/CardModel";
import { DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Effects } from "../../styles/Effects";
import { Animations } from "../../styles/Animations";

export class CardView extends Container {
    private card: CardModel;
    private _image: Sprite | null = null;
    private _backImage: Sprite | null = null;
    public dropShadowFilter: DropShadowFilter;
    public value: string = '';

    constructor(card: CardModel) {
        super();
        this.card = card;
        this.setImage();
        this.value = card.value;

        this.dropShadowFilter = new DropShadowFilter(Effects.CARD_DROP_SHADOW);
        this.filters = [this.dropShadowFilter];
    }

    private async setImage() {
        this._backImage = await Main.assetsLoader.getSprite('card_back');
        this._image = await Main.assetsLoader.getSprite(this.value);
        this.addChild(this._backImage);
    }

    public async open() {
        if (this.card.hidden) return;
        if (!this._image || !this.backImage) return;

        this._image.scale.y = this.backImage.scale.y;
        this._image.scale.x = 0;
        this.addChildAt(this._image, 0);
        await Animations.cards.open(this);
    }

    get image() {
        if (this.card.hidden) return;
        return this._image;
    }

    get backImage() {
        return this._backImage;
    }
}