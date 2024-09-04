import { Application, Container, Text } from "pixi.js";
import { Main } from "../main";
import { Background } from "./scenes/sceneComponents/Background";
import { InitialScene } from "./scenes/InitialScene";
import { GameScene } from "./scenes/GameScene";
import { HeaderPanel } from "./scenes/sceneComponents/HeaderPanel";
import { ERoundState, IStateInfo, TRoundResult } from "../model/RoundModel";
import { CardModel } from "../model/CardModel";
import { BetPanel } from "./scenes/sceneComponents/BetPanel";
import { GamePanel } from "./scenes/sceneComponents/GamePanel";
import { FinalPanel } from "./scenes/sceneComponents/FinalPanel";
import { TParticipants } from "../data/types";
import { Textstyles } from "./styles/TextStyles";

export class GameView {
    private appStage: Container;
    private roundState: ERoundState | null = null;
    private currentScene: IScene<IStateInfo> | null = null;
    private currentFooterPanel: IPanel | null = null;
    private initialScene: InitialScene | null = null;
    private headerPanel: HeaderPanel | null = null;
    private betPanel: BetPanel | null = null;
    private gamePanel: GamePanel | null = null;
    private finalPanel: FinalPanel | null = null;
    private gameScene: GameScene | null = null;
    private playerBalance = 0;
    private totalWin = 0;

    constructor(app: Application, playerBalance: number, totalWin: number) {
        this.appStage = app.stage;
        this.playerBalance = playerBalance;
        this.init();
    }

    private init() {
        this.setEventListeners();
        this.appStage.addChild(new Background());
    }

    private setEventListeners() {
        Main.signalController.card.deal.add(this.onCardDeal, this);
        Main.signalController.card.open.add(this.onCardOpen, this);
        Main.signalController.round.end.add(this.onRoundEnd, this);
        Main.signalController.round.changeState.add(this.renderScene, this);
    }

    public renderScene(stateInfo: IStateInfo) {
        switch (stateInfo.currentState) {
            case ERoundState.BETTING:
                this.renderGameScene();
                this.renderBetPanel(stateInfo.bet);
                this.renderHeaderPanel(stateInfo, this.playerBalance, this.totalWin);
                break;
            case ERoundState.CARDS_DEALING:
                this.renderGamePanel();
                break;
            case ERoundState.ROUND_OVER:
                this.renderFinalPanel();
                if (stateInfo.win > 0) {
                    this.renderWinPopup();
                }
                break;
        }
    }

    public renderInitialScene() {
        this.currentScene && this.appStage.removeChild(this.currentScene);
        if (!this.initialScene) this.initialScene = new InitialScene();
        this.currentScene = this.appStage.addChild(this.initialScene);
    }

    private renderHeaderPanel(stateInfo: IStateInfo, playerBalance: number, totalWin: number) {
        this.headerPanel = new HeaderPanel(stateInfo.bet, stateInfo.win, playerBalance, totalWin);
        this.headerPanel.position.set(0, 0);
        this.appStage.addChild(this.headerPanel);
    }

    private renderGameScene() {
        this.currentScene && this.appStage.removeChild(this.currentScene);
        console.log('new game scene')
        this.gameScene = new GameScene();
        this.currentScene = this.appStage.addChild(this.gameScene);
    }

    private renderBetPanel(betSize: number) {
        if (!this.betPanel) this.betPanel = new BetPanel(betSize);
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.currentFooterPanel = this.betPanel;
        this.betPanel.position.set(0, Main.screenSize.height)
        this.currentScene && this.currentScene.addChild(this.betPanel);
    }

    private renderGamePanel() {
        if (!this.gamePanel) this.gamePanel = new GamePanel();
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.currentFooterPanel = this.gamePanel;
        this.gamePanel.position.set(0, Main.screenSize.height)
        this.currentScene && this.currentScene.addChild(this.gamePanel);
    }

    private renderFinalPanel() {
        if (!this.finalPanel) this.finalPanel = new FinalPanel();
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.currentFooterPanel = this.finalPanel;
        this.finalPanel.position.set(0, Main.screenSize.height)
        this.currentScene && this.currentScene.addChild(this.finalPanel);
    }

    private async renderWinPopup() {
        const background = await Main.assetsLoader.getSprite('finalLabel');
        background.anchor.set(0.5);
        background.position.set(Main.screenSize.width / 2, Main.screenSize.height / 2)
        const text = new Text('15037$', Textstyles.WIN_TEXTSTYLE);
        text.anchor.set(0.5, 0)
        text.position.set(0, 80)
        background.addChild(text);
        this.appStage.addChild(background);
    }

    private resize() {
    }

    private onCardDeal(data: { person: TParticipants, card: CardModel, totalPoints: number }) {
        const { person, card, totalPoints } = data;
        this.gameScene?.onCardDeal(person, card, totalPoints);
    }

    private onCardOpen(data: { card: CardModel, totalPoints: number }) {
        const { card, totalPoints } = data;
        this.gameScene?.onCardOpen(card, totalPoints);
    }

    private deactivate() {
        Main.signalController.card.deal.remove(this.onCardDeal);
        Main.signalController.card.open.remove(this.onCardOpen);
        Main.signalController.round.end.remove(this.onRoundEnd);
        Main.signalController.round.changeState.remove(this.renderScene);
    }

    private onRoundEnd(result: TRoundResult) {
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