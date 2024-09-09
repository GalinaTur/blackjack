import { Container, Text } from "pixi.js";
import { Main } from "../../main";
import { CardView } from "./sceneComponents/CardView";
import { TRoundResult, IScene } from "../../data/types";
import { Textstyles } from "../styles/TextStyles";
import { CardModel } from "../../model/CardModel";
import { TParticipants } from "../../data/types";
import { ChipView } from "./sceneComponents/ChipView";
import { Animations } from "../styles/Animations";
import { Hand } from "./sceneComponents/Hand";

export class GameScene extends Container implements IScene<void> {
    private dealersHand = new Hand();
    private playersHand = new Hand();
    private splitHand = new Hand();
    private chipsStack = new Container();

    constructor() {
        super();
        this.init();
        this.sortableChildren = true;
        this.chipsStack.zIndex = 1;
        this.addChild(this.chipsStack);
    }

    private init() {
        this.setEventListeners();
        this.dealersHand.position.set(Main.screenSize.width / 2.1, Main.screenSize.height * 0.3);
        this.playersHand.position.set(Main.screenSize.width / 2.1, Main.screenSize.height * 0.7);
        this.addChild(this.dealersHand, this.playersHand);
    }

    private setEventListeners() {
        Main.signalController.bet.cleared.add(this.onBetClear, this);
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

    private async createLabel(message: string, imageName: string) {
        const image = await Main.assetsLoader.getSprite('win_label');
        image.anchor.set(0.5);
        image.position.set(100, 35);
        const text = new Text(message, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
    }

    private async setShine() {
        const shine = await Main.assetsLoader.getSprite('shine');
        shine.anchor.set(0.5);
        shine.scale.set(0.8)
        return shine;
    }

    public async onCardDeal(person: TParticipants, card: CardModel, points: number) {
        let hand: Hand | null = null;
        if (person === 'dealer') hand = this.dealersHand;
        if (person === 'player') hand = this.playersHand;
        if (!hand) return;

        const cardView = new CardView(card);
        await hand.dealCard(cardView);
        if (hand.cards.length < 1) return;
        hand.points = points;
    }

    public async onCardOpen(card: CardModel, points: number) {
        const cardView = this.dealersHand.cards.find((cardView) => cardView.value === card.value);
        if (!cardView) return;  
        await cardView.open();
        this.dealersHand.points = points;
    }

    public addChipToStack(chip: ChipView) {
        const index = this.chipsStack.children.length;
        Animations.chip.place(chip, index);
        chip.dropShadowFilter.offset.x = -6*index;
        chip.dropShadowFilter.offset.y = 0;
        chip.dropShadowFilter.alpha -=0.1* index;
        chip.dropShadowFilter.blur +=0.5* index;
        this.chipsStack.addChild(chip);
    }

    // onBetAdd()

    private async onBetClear() {
        await Animations.chipStack.remove(this.chipsStack);
        this.chipsStack.removeChildren();
        this.chipsStack.position.set(0,0)
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

    public deactivate() {
        Main.signalController.bet.cleared.remove(this.onBetClear);
    }
}