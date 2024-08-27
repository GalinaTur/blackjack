import { Application, Container, IPoint, Spritesheet } from "pixi.js";
import { BoardView } from "./BoardView";
import { Main } from "../main";
import { Background } from "./scenes/sceneComponents/Background";
import { InitialScene } from "./scenes/InitialScene";
import { GameScene } from "./scenes/GameScene";
import { BetPanel } from "./scenes/sceneComponents/BetPanel";
import { BettingScene } from "./scenes/BettingScene";
import { HeaderPanel } from "./scenes/sceneComponents/HeaderPanel";
import { ICardsDealed, IPoints } from "../model/RoundModel";


export class GameView extends Container {
    appStage: Container;
    board = new BoardView();
    cards: null | Spritesheet = null;
    currentScene: Container | null = null;
    headerPanel: HeaderPanel | null = null;
    gameScene: GameScene | null = null;

    constructor(app: Application) {
        super();
        this.appStage = app.stage;
        this.appStage.addChild(this);
        Main.APP.ticker.add(() => {
            this.resize();
        })
    }

    init() {
        Main.signalController.card.deal.add(this.onUpdate, this);
        const background = new Background();
        this.addChild(background);
    }

    renderInitialScene() {
        this.currentScene && this.removeChild(this.currentScene);
        const initialScene = new InitialScene();
        this.currentScene = this.addChild(initialScene);
    }

    renderHeaderPanel(betSize: number) {
        this.headerPanel = new HeaderPanel(betSize);
        this.headerPanel.position.set(0,0);
    }

    renderBettingScene(bets: number[]) {
        this.currentScene && this.removeChild(this.currentScene);
        const bettingScene = new BettingScene(bets);
        this.headerPanel && bettingScene.addChild(this.headerPanel);
        this.currentScene = this.addChild(bettingScene);
    }

    renderGameScene(cards: ICardsDealed, points: IPoints) {
        this.currentScene && this.removeChild(this.currentScene);
        this.gameScene = new GameScene(cards, points);
        this.headerPanel && this.gameScene.addChild(this.headerPanel);
        this.currentScene = this.addChild(this.gameScene);
    }

    resize() {
        this.board.setBackgroundSize();
    }

    onUpdate() {
        this.gameScene && this.gameScene.onUpdate();
    }
}