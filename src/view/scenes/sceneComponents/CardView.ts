import { Container, Sprite } from "pixi.js";
import { CardModel } from "../../../model/CardModel";
import { AssetsLoader } from "../../../controller/AssetsController";
import { DropShadowFilter } from "pixi-filters";

export class CardView extends Container {
card: CardModel;
image: Sprite | null = null;
dropShadowFilter: DropShadowFilter;

    constructor(card: CardModel) {
        super();
        this.card = card;
        this.setSprite();

        this.dropShadowFilter = new DropShadowFilter({
            blur:2,
            quality: 2,
            alpha: 1,
            offset: {
                x: 2,
                y: -2,
            },
            color: 0x000000});

            this.filters = [this.dropShadowFilter];
    }

    async setSprite() {
        this.image = await AssetsLoader.getSprite('cards_back');

        if (!this.card.hidden) {
            this.image = await AssetsLoader.getSprite(this.card.value);
        }

        this.image.anchor.set(0.5);
        this.image.scale.set(0.4);
        this.addChild(this.image);
    }
}