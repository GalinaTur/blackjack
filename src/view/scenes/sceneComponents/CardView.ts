import { Container, Sprite } from "pixi.js";
import { CardModel } from "../../../model/CardModel";
import { DropShadowFilter } from "pixi-filters";
import { Main } from "../../../main";
import { Effects } from "../../styles/Effects";

export class CardView extends Container {
    private card: CardModel;
    private image: Sprite | null = null;
    private dropShadowFilter: DropShadowFilter;

    constructor(card: CardModel) {
        super();
        this.card = card;
        this.setImage();

        this.dropShadowFilter = new DropShadowFilter(Effects.CARD_DROP_SHADOW);
        this.filters = [this.dropShadowFilter];
    }

    private async setImage() {
        this.image = await Main.assetsLoader.getSprite('cards_back');

        if (!this.card.hidden) {
            this.image = await Main.assetsLoader.getSprite(this.card.value);
        }

        this.image.anchor.set(0.5);
        this.image.scale.set(0.4);
        this.addChild(this.image);
    }
}