import { Application, Container, Text } from "pixi.js";
import { Main } from "../main";
import { Background } from "./scenes/sceneComponents/Background";
import { InitialScene } from "./scenes/InitialScene";
import { GameScene } from "./scenes/GameScene";
import { HeaderPanel } from "./scenes/sceneComponents/HeaderPanel";
import { ERoundState, IPanel, IScene, IStateInfo, TRoundResult } from "../data/types";
import { CardModel } from "../model/CardModel";
import { BetPanel } from "./scenes/sceneComponents/BetPanel";
import { GamePanel } from "./scenes/sceneComponents/GamePanel";
import { FinalPanel } from "./scenes/sceneComponents/FinalPanel";
import { TParticipants } from "../data/types";
import { Textstyles } from "./styles/TextStyles";
import { Panel } from "./scenes/sceneComponents/Panel";

export class GameView {
    private appStage: Container;
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
        this.totalWin = totalWin;
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
        Main.signalController.round.changeState.add(this.render, this);
    }

    public render(stateInfo: IStateInfo) {
        switch (stateInfo.currentState) {
            case ERoundState.BETTING:
                this.gameScene = new GameScene();
                this.setCurrentScene(this.gameScene);
                this.renderHeaderPanel(stateInfo, this.playerBalance, this.totalWin);

                this.betPanel = new BetPanel(stateInfo.bet);
                this.setCurrentFooterPanel(this.betPanel);
                break;

            case ERoundState.CARDS_DEALING:
                this.gamePanel = new GamePanel();
                this.setCurrentFooterPanel(this.gamePanel);
                break;

            case ERoundState.ROUND_OVER:
                this.finalPanel = new FinalPanel();
                this.setCurrentFooterPanel(this.finalPanel);

                if (stateInfo.win > 0) {
                    this.renderWinPopup(stateInfo.win);
                }
                break;
        }
    }

    public renderInitialScene() {
        this.initialScene = new InitialScene();
        this.setCurrentScene(this.initialScene);
    }

    private renderHeaderPanel(stateInfo: IStateInfo, playerBalance: number, totalWin: number) {
        this.headerPanel = new HeaderPanel(stateInfo.bet, stateInfo.win, playerBalance, totalWin);
        this.headerPanel.position.set(0, 0);
        this.appStage.addChild(this.headerPanel);
    }

    private setCurrentScene<T>(scene: IScene<T>) {
        this.currentScene && this.appStage.removeChild(this.currentScene);
        this.currentScene = this.appStage.addChild(scene);
    }

    private setCurrentFooterPanel(footerPanel: Panel) {
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.currentFooterPanel = footerPanel;
        this.currentScene && this.currentScene.addChild(footerPanel);
        this.currentFooterPanel.position.set(0, Main.screenSize.height)
    }

    private async renderWinPopup(winSize: number) {
        const background = await Main.assetsLoader.getSprite('finalLabel');
        background.anchor.set(0.5);
        background.position.set(Main.screenSize.width / 2, Main.screenSize.height * 0.4)
        const text = new Text(`${winSize}$`, Textstyles.WIN_TEXTSTYLE);
        text.anchor.set(0.5, 0)
        text.position.set(0, 80)
        background.addChild(text);
        this.appStage.addChild(background);
    }

    private async onCardDeal(data: { person: TParticipants, card: CardModel, totalPoints: number, resolve: (value: unknown) => void }) {
        const { person, card, totalPoints, resolve } = data;
        await this.gameScene?.onCardDeal(person, card, totalPoints);
        resolve(true);
    }

    private async onCardOpen(data: { card: CardModel, totalPoints: number, resolve: (value: unknown) => void }) {
        const { card, totalPoints, resolve } = data;
        await this.gameScene?.onCardOpen(card, totalPoints);
        resolve(true);
    }

    private onRoundEnd(result: TRoundResult) {
        this.gameScene?.onRoundEnd(result);
        this.deactivate();
    }
    private deactivate() {
        // Main.signalController.bet.added.remove(this.onBetAdd);
        Main.signalController.card.deal.remove(this.onCardDeal);
        Main.signalController.card.open.remove(this.onCardOpen);
        Main.signalController.round.end.remove(this.onRoundEnd);
        Main.signalController.round.changeState.remove(this.render);
    }
}