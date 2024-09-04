import { Container, Text } from "pixi.js";
import { Main } from "../../main";
import { CardView } from "./sceneComponents/CardView";
import { ICardsDealed, TRoundResult } from "../../model/RoundModel";
import { Textstyles } from "../styles/TextStyles";
import { CardModel } from "../../model/CardModel";
import { IScene } from "../GameView";
import { TParticipants } from "../../data/types";

export class GameScene extends Container implements IScene<void> {
    private dealersHand = new Container();
    private playersHand = new Container();
    private splitHand = new Container();
    private cards: ICardsDealed = {
        dealer: [],
        player: [],
        split: []
    };

    constructor() {
        super();
        this.init();
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
        image.position.set(Main.screenSize.width/2, Main.screenSize.height/2);
        const text = new Text("PUSH", Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        image.addChild(text);
        this.addChild(image);
    }

    private async setCard(parent: Container, card: CardModel, index: number) {
        const cardView = new CardView(card);
        cardView.position.set(index * 50, 0);
        parent.addChild(cardView);
    }

    private async setPointsLabel(parent: Container, points: number) {
        const label = await Main.assetsLoader.getSprite("points_label");
        label.anchor.set(0.5)
        label.position.set(0, 35);
        const text = new Text(points, Textstyles.LABEL_TEXTSTYLE);
        text.anchor.set(0.5);
        label.zIndex = 1
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

    public onCardDeal(person: TParticipants, card: CardModel, points: number) {
        if (person === 'dealer') {
            this.cards.dealer.push(card);
            this.setCard(this.dealersHand, card, this.cards.dealer.length - 1);
            this.setPointsLabel(this.dealersHand, points);
        } else if (person === 'player') {
            this.cards.player.push(card);
            this.setCard(this.playersHand, card, this.cards.player.length - 1);
            this.setPointsLabel(this.playersHand, points);
        }
    }

    public onCardOpen(card: CardModel, points: number) {
        console.log('hole card opened');
        this.setCard(this.dealersHand, card, this.cards.dealer.length - 1);
        this.setPointsLabel(this.dealersHand, points);
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