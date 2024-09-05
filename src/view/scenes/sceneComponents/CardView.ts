import { Container, Sprite } from "pixi.js";
import { CardModel } from "../../../model/CardModel";
import { DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Effects } from "../../styles/Effects";
import { Animations } from "../../styles/Animations";

export class CardView extends Container {
    private card: CardModel;
    private image: Sprite | null = null;
    private backImage: Sprite | null = null;
    private dropShadowFilter: DropShadowFilter;
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
        this.backImage = await Main.assetsLoader.getSprite('cards_back');
        this.image = await Main.assetsLoader.getSprite(this.value);

        this.backImage.anchor.set(0.5);
        this.backImage.scale.set(0.4);

        this.image.anchor.set(0.5);
        this.image.scale.set(0.4);

        console.log(this.card.hidden)
        this.card.hidden? this.addChild(this.backImage) : this.addChild(this.image);
    }

    public async open() {
        if (this.card.hidden) return;
        if (!this. image || !this.backImage) return;

        this.image.scale.x = 0;
        this.addChildAt(this.image, 0);
        await Animations.cards.open(this.backImage, this.image);
    }
}