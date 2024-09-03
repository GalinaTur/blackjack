import { Application, Container, Spritesheet } from "pixi.js";
import { Main } from "../main";
import { Background } from "./scenes/sceneComponents/Background";
import { InitialScene } from "./scenes/InitialScene";
import { GameScene } from "./scenes/GameScene";
// import { BettingScene } from "./scenes/BettingScene";
import { HeaderPanel } from "./scenes/sceneComponents/HeaderPanel";
import { ERoundState, ICardsDealed, IPoints, IStateInfo, TRoundResult } from "../model/RoundModel";
import { CardModel } from "../model/CardModel";
import { BetPanel } from "./scenes/sceneComponents/BetPanel";
import { GamePanel } from "./scenes/sceneComponents/GamePanel";
import { FinalPanel } from "./scenes/sceneComponents/FinalPanel";
import { TParticipants } from "../data/types";

export class GameView {
    appStage: Container;
    roundState: ERoundState | null = null;
    currentScene: IScene<IStateInfo> | null = null;
    currentFooterPanel: IPanel | null = null;
    initialScene: InitialScene | null = null;
    headerPanel: HeaderPanel | null = null;
    betPanel: BetPanel | null = null;
    gamePanel: GamePanel | null = null;
    finalPanel: FinalPanel | null = null;
    gameScene: GameScene | null = null;
    // finalScene: FinalScene | null = null;

    constructor(app: Application) {
        // super();
        this.appStage = app.stage;
        // this.appStage.addChild(this);
        // Main.APP.ticker.add(() => {
        //     this.resize();
        // })
    }

    init() {
        Main.signalController.card.deal.add(this.onCardDeal, this);
        Main.signalController.card.open.add(this.onCardOpen, this);
        Main.signalController.round.end.add(this.onRoundEnd, this);
        Main.signalController.round.changeState.add(this.renderScene, this);
        const background = new Background();
        this.appStage.addChild(background);
    }

    renderScene(stateInfo: IStateInfo) {
        switch (stateInfo.currentState) {
            // case ERoundState.NOT_STARTED:
            //     this.renderInitialScene();
            //     break;
            case ERoundState.BETTING:
                this.renderGameScene();
                this.renderBetPanel(stateInfo.bet);
                this.renderHeaderPanel(stateInfo.bet);
                break;
            case ERoundState.CARDS_DEALING:
                this.renderGamePanel();
                // this.renderHeaderPanel(stateInfo.bet);
                break;
            case ERoundState.ROUND_OVER:
                this.renderFinalPanel();
                break;
        }
    }

    renderInitialScene() {
        this.currentScene && this.appStage.removeChild(this.currentScene);
        if (!this.initialScene) this.initialScene = new InitialScene();
        this.currentScene = this.appStage.addChild(this.initialScene);
    }

    renderHeaderPanel(betSize: number) {
        this.headerPanel = new HeaderPanel(betSize);
        this.headerPanel.position.set(0, 0);
        this.appStage.addChild(this.headerPanel);
    }

    renderBetPanel(betSize: number) {
        if (!this.betPanel) this.betPanel = new BetPanel(betSize);
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.currentFooterPanel = this.betPanel;
        this.betPanel.position.set(0, Main.screenSize.height)
        this.currentScene && this.currentScene.addChild(this.betPanel);
    }

    renderGameScene() {
        // if (this.gameScene) this.gameScene.onUpdate(card, points);
        this.currentScene && this.appStage.removeChild(this.currentScene);
        console.log('new game scene')
        this.gameScene = new GameScene();
        // this.headerPanel && this.gameScene.addChild(this.headerPanel);
        this.currentScene = this.appStage.addChild(this.gameScene);
    }

    renderGamePanel() {
        if (!this.gamePanel) this.gamePanel = new GamePanel();
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.currentFooterPanel = this.gamePanel;
        this.gamePanel.position.set(0, Main.screenSize.height)
        this.currentScene && this.currentScene.addChild(this.gamePanel);
    }

    renderFinalPanel() {
        if (!this.finalPanel) this.finalPanel = new FinalPanel();
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.currentFooterPanel = this.finalPanel;
        this.finalPanel.position.set(0, Main.screenSize.height)
        this.currentScene && this.currentScene.addChild(this.finalPanel);
    }

    resize() {
    }

    onCardDeal(data: { person: TParticipants, card: CardModel, totalPoints: number }) {
        const { person, card, totalPoints } = data;
        this.gameScene?.onCardDeal(person, card, totalPoints);
    }

    onCardOpen(data: { card: CardModel, totalPoints: number }) {
        const { card, totalPoints } = data;
        this.gameScene?.onCardOpen(card, totalPoints);
    }

    deactivate() {
        Main.signalController.card.deal.remove(this.onCardDeal);
        Main.signalController.card.open.remove(this.onCardOpen);
        Main.signalController.round.end.remove(this.onRoundEnd);
        Main.signalController.round.changeState.remove(this.renderScene);
    }

    onRoundEnd(result: TRoundResult) {
        this.gameScene?.onRoundEnd(result);
        this.deactivate();
    }
}

export interface IScene<T> extends Container {
    onResize(): void,
    // onUpdate(data: IStateInfo): void,
}

export interface IPanel extends Container {
    deactivate(): void
}