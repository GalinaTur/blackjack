import { Container, Point, Sprite, Text } from "pixi.js";
import { CardView } from "./CardView";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Animations } from "../../styles/Animations";
import { TResult } from "../../../data/types";


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

    public async dealCard(card: CardView, globalPosition: Point) {
        this.addChild(card);
        const localPosition = this.toLocal(globalPosition);
        card.position.set(localPosition.x, localPosition.y);
        await Animations.cards.deal(card, this._cards.length - 1, card.animatedOpen.bind(card));
        this._cards.push(card);
    }

    public async setRegularLabel(message: string) {
        const label = await this.createLabel('regular_label', message);
        Animations.label.showRegular(label)
        this.addChild(label);
    }

    public async setBJLabel() {
        const image = await Main.assetsLoader.getSprite('BJ_label');
        image.scale.set(0)
        image.anchor.set(0.5);
        image.position.set(5);
        image.zIndex = 2;
        this.addChild(image);
        Animations.label.showWin(image);
    }

    protected async createLabel(img: string, message: string) {
        const image = await Main.assetsLoader.getSprite(img);
        image.anchor.set(0.5);
        image.position.set(70, 20);
        image.scale.set();
        const text = new Text(message, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        return image;
    }

    private async setPointsLabel(points: number) {
        if (this.pointsLabel) {
            this.updatePointsLabel(points);
            return;
        }

        this.pointsLabel = await Main.assetsLoader.getSprite("points_label");
        this.pointsLabel.anchor.set(0, 0.5);
        this.pointsLabel.position.set(-40, 20);
        this.pointsLabel.scale.set(0, 0.7);
        this.pointsLabel.zIndex = 1;

        const text = new Text(points, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        text.position.set(40, 0.5);
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