import { Container, Point, Sprite, Text } from "pixi.js";
import { CardView } from "./CardView";
import { Main } from "../../../main";
import { Textstyles } from "../../styles/TextStyles";
import { Animations } from "../../styles/Animations";
import { TParticipants } from "../../../data/types";
import { SOUNDS } from "../../../data/constants";


export class Hand extends Container {
    private pointsLabel: Sprite | null = null;
    private _cards: CardView[] = [];
    protected label: Sprite | null = null;

    constructor(public name: TParticipants) {
        super();
        this.init();
    }

    private init() {
        this.sortableChildren = true;
    }

    public async dealCard(card: CardView, globalPosition: Point, resolveAt: string) {
        this.addChild(card);
        const localPosition = this.toLocal(globalPosition);
        card.position.set(localPosition.x, localPosition.y);
        this.playSound(SOUNDS.dealCard);
        await Animations.cards.deal(card, this._cards.length - 1, card.animatedOpen.bind(card), resolveAt);
        this._cards.push(card);
    }

    public setRegularLabel(message: string) {
        const label = this.createLabel('regular_label', message);
        Animations.label.showRegular(label);
        this.label = label
        this.addChild(label);
    }

    public setBJLabel() {
        const label = Main.assetsController.getSprite('BJ_label');
        label.scale.set(0)
        label.anchor.set(0.5);
        label.position.set(5);
        label.zIndex = 2;
        this.addChild(label);
        Animations.label.showWin(label);
        this.label = label
    }

    protected createLabel(img: string, message: string) {
        const image = Main.assetsController.getSprite(img);
        image.anchor.set(0.5);
        image.position.set(70, 20);
        image.scale.set();
        const text = new Text(message, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        return image;
    }

    private setPointsLabel(points: number) {
        if (this.pointsLabel) {
            this.updatePointsLabel(points);
            return;
        }

        this.pointsLabel = Main.assetsController.getSprite("points_label");
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

    protected playSound(soundID: string) {
        const sound = Main.assetsController.getSound(soundID);
        sound.play();
    }

    set points(points: number) {
        this.setPointsLabel(points);
    }

    get cards() {
        return this._cards;
    }

    get hasLabel() {
        return Boolean(this.label);
    }
}