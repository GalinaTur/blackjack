import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { Main } from "../../main";
import { GamePanel } from "./sceneComponents/GamePanel";
import { CardView } from "./sceneComponents/CardView";
import { ICardsDealed, IPoints, TRoundResult } from "../../model/RoundModel";
import { Textstyles } from "../styles/TextStyles";
import { CardModel } from "../../model/CardModel";
import { IScene } from "../GameView";

export class GameScene extends Container implements IScene<void> {
    gamePanel: GamePanel;
    dealersHand = new Container();
    playersHand = new Container();
    splitHand = new Container();
    cards: ICardsDealed;
    points: IPoints;
    // popup: Sprite | null;

    constructor(cards: ICardsDealed, points: IPoints) {
        super();
        this.gamePanel = new GamePanel();
        this.cards = cards;
        this.points = points;
        this.init();
    }

    private init() {
        this.setPanels();
        this.setPlayersHand();
        this.setDealersHand();
    }

    private async setPanels() {
        this.gamePanel.position.set(0, Main.screenSize.height);
        this.addChild(this.gamePanel);
    }

    private async setDealersHand() {
        this.dealersHand.sortableChildren = true;
        this.dealersHand.position.set(Main.screenSize.width / 2.1, Main.screenSize.height * 0.3);
        await this.setCards(this.dealersHand, this.cards.dealer);
        await this.setPointsLabel(this.dealersHand, this.points.dealer);
        this.addChild(this.dealersHand);
    }

    private async setPlayersHand() {
        this.playersHand.sortableChildren = true;
        this.playersHand.position.set(Main.screenSize.width / 2.1, Main.screenSize.height * 0.7);
        await this.setCards(this.playersHand, this.cards.player);
        this.setPointsLabel(this.playersHand, this.points.player);
        this.addChild(this.playersHand);
    }

    private async setCards(parent: Container, cards: CardModel[]) {
        cards.forEach((card, index) => {
            const cardView = new CardView(card);
            cardView.position.set(index * 50, 0);
            parent.addChild(cardView);
        })
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

    onUpdate() {
        this.setPlayersHand();
        this.setDealersHand();
    }
    
    onResize() {

    }

    async onRoundEnd(result: TRoundResult) {
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
            case "loss":
                this.setRegularLabel(this.playersHand, 'LOSE');
                break;
            case "push":
                this.setRegularLabel(this.playersHand, 'PUSH');
                break;
        }
    }

    resize() {

    };
}