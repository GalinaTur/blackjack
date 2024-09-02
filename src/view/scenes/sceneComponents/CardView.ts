import { Container, Sprite } from "pixi.js";
import { CardModel } from "../../../model/CardModel";
import { DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";

export class CardView extends Container {
    card: CardModel;
    image: Sprite | null = null;
    dropShadowFilter: DropShadowFilter;
    dropShadowFilterOptions = {
        blur: 1,
        quality: 1,
        alpha: 0.5,
        offset: {
            x: 1,
            y: 1,
        },
        color: 0x000000
    }

    constructor(card: CardModel) {
        super();
        this.card = card;
        this.setSprite();

        this.dropShadowFilter = new DropShadowFilter(this.dropShadowFilterOptions);
        this.filters = [this.dropShadowFilter];
    }

    async setSprite() {
        this.image = await Main.assetsLoader.getSprite('cards_back');

        if (!this.card.hidden) {
            this.image = await Main.assetsLoader.getSprite(this.card.value);
        }

        this.image.anchor.set(0.5);
        this.image.scale.set(0.4);
        this.addChild(this.image);
    }
}