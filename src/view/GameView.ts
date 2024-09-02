import { Application, Container, Spritesheet } from "pixi.js";
import { Main } from "../main";
import { Background } from "./scenes/sceneComponents/Background";
import { InitialScene } from "./scenes/InitialScene";
import { GameScene } from "./scenes/GameScene";
import { BettingScene } from "./scenes/BettingScene";
import { HeaderPanel } from "./scenes/sceneComponents/HeaderPanel";
import { ICardsDealed, IPoints, TRoundResult } from "../model/RoundModel";


export class GameView extends Container {
    appStage: Container;
    cards: null | Spritesheet = null;
    currentScene: IScene<void|number> | null = null;
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
        Main.signalController.card.deal.add(this.update, this);
        Main.signalController.card.open.add(this.update, this);
        Main.signalController.bet.updated.add(this.update, this)
        Main.signalController.round.end.add(this.onRoundEnd, this);
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

    renderBettingScene(bets: number[], betSize: number) {
        this.currentScene && this.removeChild(this.currentScene);
        const bettingScene = new BettingScene(bets, betSize);
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
    }

    update() {
        this.currentScene && this.currentScene.onUpdate();
    }

    onRoundEnd(result: TRoundResult) {
        this.gameScene?.onRoundEnd(result);
    }
}

export interface IScene<T> extends Container {
    onResize(): void,
    onUpdate(data: T): void,
}