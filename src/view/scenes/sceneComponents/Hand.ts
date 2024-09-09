import { Container, Sprite, Text } from "pixi.js";
import { CardView } from "./CardView";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Animations } from "../../styles/Animations";

export class Hand extends Container {
    private pointsLabel: Sprite | null = null;
    private _cards: CardView[] = [];

    constructor() {
        super();
        this.init();
    }

    private init() {
        this.sortableChildren = true;
    }

    public async dealCard(card: CardView) {
        this.addChild(card);
        this._cards.push(card);
        await Animations.cards.deal(card, this._cards.length-1);
    }

    private addLabel() {

    }

    private async setPointsLabel(points: number) {
        if (this.pointsLabel) {
            this.updatePointsLabel(points);
            return;
        }

        this.pointsLabel = await Main.assetsLoader.getSprite("points_label");
        this.pointsLabel.anchor.set(0, 0.5);
        this.pointsLabel.position.set(-50, 35);
        this.pointsLabel.scale.set(0, 1);
        this.pointsLabel.zIndex = 1;

        const text = new Text(points, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5, 0.5);
        text.position.set(50, 0.5);
        Animations.cards.addPointsLabel(this.pointsLabel);
        this.pointsLabel.addChild(text);
        this.addChild(this.pointsLabel);
    }

    private updatePointsLabel(points: number) {
        if (!this.pointsLabel) return;
        const text = this.pointsLabel.getChildAt(0) as Text;
        text.text = points.toString();
        Animations.cards.updatePointsLabel(this.pointsLabel);
    }

    set points(points: number) {
        this.setPointsLabel(points);
    }

    get cards() {
        return this._cards;
    }
}