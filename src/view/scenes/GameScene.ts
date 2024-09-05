import { Container, Text } from "pixi.js";
import { Main } from "../../main";
import { CardView } from "./sceneComponents/CardView";
import { ICardsDealed, TRoundResult, IScene } from "../../data/types";
import { Textstyles } from "../styles/TextStyles";
import { CardModel } from "../../model/CardModel";
import { TParticipants } from "../../data/types";
import { ChipView } from "./sceneComponents/ChipView";
import { Animations } from "../styles/Animations";

export class GameScene extends Container implements IScene<void> {
    private dealersHand = new Container();
    private playersHand = new Container();
    private splitHand = new Container();
    private chipsStack = new Container();
    private cards: ICardsDealed = {
        dealer: [],
        player: [],
        split: []
    };

    constructor() {
        super();
        this.init();
        this.sortableChildren = true;
        this.chipsStack.zIndex = 1;
        this.addChild(this.chipsStack);
    }

    private init() {
        this.setPlayersHand();
        this.setDealersHand();
    }

    private async setDealersHand() {
        this.dealersHand.sortableChildren = true;
        this.dealersHand.position.set(Main.screenSize.width / 2.1, Main.screenSize.height * 0.3);
        this.addChild(this.dealersHand);
    }

    private async setPlayersHand() {
        this.playersHand.sortableChildren = true;
        this.playersHand.position.set(Main.screenSize.width / 2.1, Main.screenSize.height * 0.7);
        this.addChild(this.playersHand);
    }

    private async setPushLabel() {
        const image = await Main.assetsLoader.getSprite('regular_label');
        image.anchor.set(0.5);
        image.position.set(Main.screenSize.width / 2, Main.screenSize.height / 2);
        const text = new Text("PUSH", Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        this.addChild(image);
    }

    private async setCard(parent: Container, card: CardModel, index: number) {
        const cardView = new CardView(card);
        cardView.position.set(500, -1500);
        parent.addChild(cardView)
        await Animations.cards.deal(cardView, index);
    }

    private async setPointsLabel(parent: Container, points: number) {
        const label = await Main.assetsLoader.getSprite("points_label");
        label.anchor.set(0, 0.5)
        label.position.set(-50, 35);
        label.scale.set(0, 1);
        const text = new Text(points, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5, 0.5);
        text.position.set(50, 0.5);
        label.zIndex = 1
        Animations.cards.addPointsLabel(label);
        label.addChild(text);
        parent.addChild(label);
    }

    private async setBJLabel(parent: Container) {
        const image = await Main.assetsLoader.getSprite('BJ_label');
        image.scale.set(0.6)
        image.anchor.set(0.5);
        image.position.set(30, 20);
        image.zIndex = 2;
        const shine = await this.setShine();
        shine.position.set(image.position.x, image.position.y);
        shine.anchor.y = 0.4
        parent.addChild(shine);
        parent.addChild(image);
    }

    private async setRegularLabel(parent: Container, message: string) {
        const image = await Main.assetsLoader.getSprite('regular_label');
        image.anchor.set(0.5);
        image.position.set(100, 35);
        const text = new Text(message, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        parent.addChild(image);
    }

    private async setWinLabel(parent: Container, message: string) {
        const image = await Main.assetsLoader.getSprite('win_label');
        image.anchor.set(0.5);
        image.position.set(100, 35);
        const text = new Text(message, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        const shine = await this.setShine();
        shine.position.set(image.position.x, image.position.y);
        parent.addChild(shine);
        parent.addChild(image);
    }

    private async setShine() {
        const shine = await Main.assetsLoader.getSprite('shine');
        shine.anchor.set(0.5);
        shine.scale.set(0.8)
        return shine;
    }

    public async onCardDeal(person: TParticipants, card: CardModel, points: number) {
        if (person === 'dealer') {
            this.cards.dealer.push(card);
            await this.setCard(this.dealersHand, card, this.cards.dealer.length - 1);
            if (this.cards.dealer.length < 2) return;
            this.setPointsLabel(this.dealersHand, points);
        } else if (person === 'player') {
            this.cards.player.push(card);
            await this.setCard(this.playersHand, card, this.cards.player.length - 1);
            if (this.cards.player.length < 2) return;
            this.setPointsLabel(this.playersHand, points);
        }
    }

    public async onCardOpen(card: CardModel, points: number) {
        const cardIndex = this.cards.dealer.findIndex((cardElement) => cardElement.value === card.value);
        const cardView = this.dealersHand.children[cardIndex] as CardView;
        await cardView.open();
        this.setPointsLabel(this.dealersHand, points);
    }

    public addChipToStack(chip: ChipView) {
        const index = this.chipsStack.children.length;
        Animations.chip.place(chip, index);
        chip.dropShadowFilter.offset.x +=6*index;
        chip.dropShadowFilter.offset.y = 0;
        chip.dropShadowFilter.alpha -=0.1* index;
        chip.dropShadowFilter.blur +=0.5* index;
        this.chipsStack.addChild(chip);
    }

    public onResize() {
    }

    public async onRoundEnd(result: TRoundResult) {
        switch (result) {
            case "dealerBJ":
                this.setBJLabel(this.dealersHand);
                this.setRegularLabel(this.playersHand, 'LOSE');
                break;
            case "playerBJ":
                this.setBJLabel(this.playersHand);
                break;
            case "playerBust":
                this.setRegularLabel(this.playersHand, 'BUST');
                break;
            case "dealerBust":
                this.setRegularLabel(this.dealersHand, 'BUST');
                this.setWinLabel(this.playersHand, 'WIN');
                break;
            case "win":
                this.setWinLabel(this.playersHand, 'WIN');
                break;
            case "lose":
                this.setRegularLabel(this.playersHand, 'LOSE');
                break;
            case "push":
                this.setPushLabel();
                break;
            case "pushBJ":
                this.setBJLabel(this.dealersHand);
                this.setBJLabel(this.playersHand);
                this.setPushLabel();
                break;
        }
    }

    private resize() {

    };
}