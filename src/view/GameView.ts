import { Application } from "pixi.js";
import { Main } from "../main";
import { Background } from "./scenes/sceneComponents/Background";
import { InitialScene } from "./scenes/InitialScene";
import { GameScene } from "./scenes/GameScene";
import { HeaderPanel } from "./scenes/sceneComponents/HeaderPanel";
import { ERoundState, IPanel, IScene, TBets, IRoundResult, IRoundStateDTO } from "../data/types";
import { CardModel } from "../model/CardModel";
import { BetPanel } from "./scenes/sceneComponents/panels/BetPanel";
import { GamePanel } from "./scenes/sceneComponents/panels/GamePanel";
import { FinalPanel } from "./scenes/sceneComponents/panels/FinalPanel";
import { TParticipants } from "../data/types";
import { Footer } from "./scenes/sceneComponents/Footer";
import { SOUNDS } from "../data/constants";

export class GameView {
    private app: Application;
    private background: Background | null = null;
    private currentScene: IScene<IRoundStateDTO> | null = null;
    private currentFooterPanel: IPanel | null = null;
    private initialScene: InitialScene | null = null;
    private headerPanel: HeaderPanel | null = null;
    private footer: Footer | null = null;
    private betPanel: BetPanel | null = null;
    private gamePanel: GamePanel | null = null;
    private finalPanel: FinalPanel | null = null;
    private gameScene: GameScene | null = null;
    private playerBalance = 0;
    private totalWin = 0;
    private isDoubleAllowed = false;
    private splitActivated = false;
    private state: ERoundState;
    private soundsOn: boolean;

    constructor(app: Application, playerBalance: number, totalWin: number, state: ERoundState, soundsOn: boolean) {
        this.app = app;
        this.playerBalance = playerBalance;
        this.totalWin = totalWin;
        this.state = state;
        this.soundsOn = soundsOn
        this.init();
    }

    private init() {
        this.setEventListeners();
    }

    private setEventListeners() {
        Main.signalController.round.stateChanged.add(this.onStateChanged, this);
        Main.signalController.bet.updated.add(this.onBetUpdate, this);
        Main.signalController.card.deal.add(this.onCardDeal, this);
        Main.signalController.card.open.add(this.onCardOpen, this);
        Main.signalController.player.endTurn.add(this.onTurnEnd, this);
    }

    public async render(stateInfo: IRoundStateDTO, isSplitAllowed?: boolean) {
        switch (stateInfo.currentState) {
            case ERoundState.NOT_STARTED:
                this.background = new Background();
                this.background.blur();
                this.app.stage.addChild(this.background);
                break;

            case ERoundState.BETTING:
                if (!this.background) {
                    this.background = new Background();
                    this.app.stage.addChild(this.background);
                }
                this.background?.unblur();

                if (!this.gameScene) {
                    this.gameScene = new GameScene();
                    this.setCurrentScene(this.gameScene);
                }
                this.renderHeaderPanel(stateInfo, this.playerBalance, this.totalWin);
                this.renderFooter();
                this.footer?.updateText('Place your bets...')

                if (!this.betPanel) {
                    this.betPanel = new BetPanel(stateInfo.availableBets);
                    this.setCurrentFooterPanel(this.betPanel);
                } else {
                }
                break;

            case ERoundState.CARDS_DEALING:
                this.gamePanel = new GamePanel(this.isDoubleAllowed);
                this.setCurrentFooterPanel(this.gamePanel);
                break;

            case ERoundState.PLAYERS_TURN:
                stateInfo.cards.main.length === 2 && await this.gameScene?.setActiveHand('player');
                if (stateInfo.cards.split?.length === 1 && !this.splitActivated) {
                    this.splitActivated = true;
                    await this.gameScene?.splitCards(stateInfo.cards.main, stateInfo.cards.split);
                    return;
                }
                const splitAllowed = isSplitAllowed && !this.splitActivated
                this.gamePanel?.updateButtons(stateInfo.currentState, stateInfo.cards.main, this.isDoubleAllowed, splitAllowed);
                break;

            case ERoundState.SPLIT_TURN:
                stateInfo.cards.split?.length === 2 &&  await this.gameScene?.setActiveHand('split');
                if (stateInfo.cards.split!.length >= 2) {
                    this.gamePanel?.updateButtons(stateInfo.currentState, stateInfo.cards.split!, this.isDoubleAllowed);
                }
                break;

            case ERoundState.DEALERS_TURN:
                this.gameScene && await this.gameScene.setActiveHand('dealer');
                break;

            case ERoundState.ROUND_OVER:
                this.gameScene && await this.gameScene.setActiveHand('dealer');
                this.finalPanel = new FinalPanel();
                this.setCurrentFooterPanel(this.finalPanel);

                if (stateInfo.win > 0) {
                    const popup = await this.gameScene?.renderWinPopup(stateInfo.win);
                    const sound = await Main.assetsController.getSound(SOUNDS.popup);
                    sound.play();
                    popup && this.app.stage.addChild(popup);
                }
                break;
        }
    }

    private onStateChanged(state: ERoundState) {
        this.state = state;
    }
    public renderInitialScene() {
        this.initialScene = new InitialScene();
        this.setCurrentScene(this.initialScene);
    }

    private renderHeaderPanel(stateInfo: IRoundStateDTO, playerBalance: number, totalWin: number) {
        this.headerPanel = new HeaderPanel(stateInfo.win, playerBalance, totalWin);
        this.headerPanel.position.set(0, 0);
        this.app.stage.addChild(this.headerPanel);
    }

    private renderFooter() {
        this.footer = new Footer(this.soundsOn);
        this.app.stage.addChild(this.footer);
    }

    private setCurrentScene<T>(scene: IScene<T>) {
        this.currentScene && this.currentScene.deactivate();
        this.currentScene = this.app.stage.addChild(scene);
    }

    private setCurrentFooterPanel(footerPanel: IPanel) {
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.currentFooterPanel = footerPanel;
        this.currentFooterPanel.position.set(0, Main.screenSize.height)
        this.currentScene && this.currentScene.addChild(footerPanel);
    }

    private onBetUpdate(data: { betsStack: TBets[], sum: number, availableBets?: TBets[], isDoubleBetAllowed: boolean }) {
        const { betsStack, sum, availableBets, isDoubleBetAllowed } = data;
        this.headerPanel?.onBetUpdate(sum);
        this.isDoubleAllowed = isDoubleBetAllowed;
        if (availableBets) {
            this.betPanel?.onBetUpdate(sum, availableBets, isDoubleBetAllowed);
        }
        this.gameScene?.onBetUpdate(betsStack);
    }

    private async onCardDeal(data: { person: TParticipants, card: CardModel, totalPoints: number, resolve: () => void }) {
        const { person, card, totalPoints, resolve } = data;
        const resolveAt = this.state === ERoundState.CARDS_DEALING ? 'onStart' : 'onComplete';
        await this.gameScene?.onCardDeal(person, card, totalPoints, resolveAt);
        resolve();
    }

    private async onCardOpen(data: { cardIndex: number, totalPoints: number, resolve: () => void }) {
        const { cardIndex, totalPoints, resolve } = data;
        await this.gameScene?.onCardOpen(cardIndex, totalPoints);
        resolve();
    }

    private onTurnEnd(result: IRoundResult) {
        this.gameScene?.onTurnEnd(result);
    }

    public onResize() {
        if (!this.background) return;
        this.background?.onResize();
        this.footer?.onResize();
        this.currentScene?.onResize()
        if (this.currentFooterPanel) {
            this.currentFooterPanel.position.set(0, Main.APP.view.height);
            this.currentFooterPanel.onResize()
        }

    }
    public deactivate() {
        this.headerPanel?.deactivate();
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.gameScene && this.gameScene.deactivate();
        Main.signalController.bet.updated.remove(this.onBetUpdate);
        Main.signalController.card.deal.remove(this.onCardDeal);
        Main.signalController.card.open.remove(this.onCardOpen);
        Main.signalController.player.endTurn.remove(this.onTurnEnd);
    }
}