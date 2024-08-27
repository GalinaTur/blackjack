import { Container, Text, TextStyle } from "pixi.js";
import { BetPanel } from "./sceneComponents/BetPanel";
import { Main } from "../../main";
import { HeaderPanel } from "./sceneComponents/HeaderPanel";
import { GamePanel } from "./sceneComponents/GamePanel";
import { CardView } from "./sceneComponents/CardView";
import { ICardsDealed, IPoints } from "../../model/RoundModel";
import { AssetsLoader } from "../../controller/AssetsController";

export class GameScene extends Container {
    gamePanel: GamePanel;
    cards: ICardsDealed;
    points: IPoints

    constructor(cards: ICardsDealed, points: IPoints) {
        super();
        this.gamePanel = new GamePanel();
        this.cards = cards;
        this.points = points;
        this.init();
    }

    init() {
        this.setPanels();
        this.setPlayersCards();
        this.setDealersCards();
    }

    async setPanels() {
        this.gamePanel.position.set(0, Main.screenSize.height);
        this.addChild(this.gamePanel);
    }

    async setDealersCards() {
        this.cards.dealer.forEach((card, index) => {
            const cardView = new CardView(card);
            cardView.position.set(Main.screenSize.width / 2 + index * 50, Main.screenSize.height * 0.3);
            this.addChild(cardView);
        })
        const label = await this.setPointsLabel(this.points.dealer);
        label.position.set(Main.screenSize.width/2, Main.screenSize.height * 0.35)
        this.addChild(label);
    }

    async setPlayersCards() {
        this.cards.player.forEach((card, index) => {
            const cardView = new CardView(card);
            cardView.position.set(Main.screenSize.width / 2 + index * 50, Main.screenSize.height * 0.7);
            this.addChild(cardView);
        })
        const label = await this.setPointsLabel(this.points.player);
        label.position.set(Main.screenSize.width/2, Main.screenSize.height * 0.75)
        this.addChild(label);
    }

    async setPointsLabel(points: number) {
        const label = await AssetsLoader.getSprite("points_label");
        const style = new TextStyle({
            fontSize: 28,
            fill: "#ffffff",
            fontFamily: "SairaBD",
            strokeThickness: 4,
        });
        label.anchor.set(0.5)
        const text = new Text(points, style);
        text.anchor.set(0.5);
        label.addChild(text);

        return label;
    }

    onUpdate() {
        this.setPlayersCards();
        this.setDealersCards();
    }
}