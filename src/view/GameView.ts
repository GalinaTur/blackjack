import { Application } from "pixi.js";
import { Main } from "../main";
import { Background } from "./scenes/sceneComponents/Background";
import { InitialScene } from "./scenes/InitialScene";
import { GameScene } from "./scenes/GameScene";
import { Header } from "./scenes/sceneComponents/Header";
import { ERoundState, IPanel, IScene, TBets, IRoundResult, IRoundStateDTO } from "../data/types";
import { CardModel } from "../model/CardModel";
import { BetPanel } from "./scenes/sceneComponents/panels/BetPanel";
import { GamePanel } from "./scenes/sceneComponents/panels/GamePanel";
import { FinalPanel } from "./scenes/sceneComponents/panels/FinalPanel";
import { TParticipants } from "../data/types";
import { Footer } from "./scenes/sceneComponents/Footer";
import { SOUNDS } from "../data/constants";
import { Modal } from "./scenes/sceneComponents/Modal";

export class GameView {
    private background: Background | null = null;
    private currentScene: IScene<IRoundStateDTO> | null = null;
    private currentFooterPanel: IPanel | null = null;
    private initialScene: InitialScene | null = null;
    private header: Header | null = null;
    private footer: Footer | null = null;
    private betPanel: BetPanel | null = null;
    private gamePanel: GamePanel | null = null;
    private finalPanel: FinalPanel | null = null;
    private gameScene: GameScene | null = null;
    private splitActivated = false;
    private infoModal: Modal | null = null;

    constructor(private app: Application,
        private playerBalance: number,
        private totalWin: number,
        private state: ERoundState,
        private soundsOn: boolean) {
        this.init();
    }

    private init() {
        this.setEventListeners();
    }

    private setEventListeners() {
        Main.signalsController.round.endTurn.add(this.onTurnEnd, this);
        Main.signalsController.round.stateChanged.add(this.onStateChanged, this);
        Main.signalsController.bet.updated.add(this.onBetUpdate, this);
        Main.signalsController.card.deal.add(this.onCardDeal, this);
        Main.signalsController.card.open.add(this.onCardOpen, this);
        Main.signalsController.info.isOn.add(this.onModalChange, this);
    }

    public async render(stateInfo: IRoundStateDTO) {
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
                this.renderHeader(stateInfo, this.playerBalance, this.totalWin);
                this.renderFooter();
                this.footer?.updateText('Place your bets...')

                if (!this.betPanel) {
                    this.betPanel = new BetPanel(stateInfo.availableBets);
                    this.setCurrentFooterPanel(this.betPanel);
                }
                break;

            case ERoundState.CARDS_DEALING:
                this.footer?.updateText('Bet accepted. Cards dealing...')
                this.gamePanel = new GamePanel(stateInfo.isDoubleAllowed);
                this.setCurrentFooterPanel(this.gamePanel);
                break;

            case ERoundState.PLAYERS_TURN:
                const splitAllowed = stateInfo.isSplitAllowed && !this.splitActivated;
                this.footer?.setPlayerTurnText(stateInfo.isDoubleAllowed, splitAllowed);
                stateInfo.cards.main.length === 2 && this.gameScene?.setActiveHand('player');
                if (stateInfo.cards.split?.length === 1 && !this.splitActivated) {
                    this.splitActivated = true;
                    await this.gameScene?.splitCards(stateInfo.cards.main, stateInfo.cards.split);
                    return;
                }
                this.gamePanel?.updateButtons(stateInfo.currentState, stateInfo.cards.main, stateInfo.isDoubleAllowed, splitAllowed);
                break;

            case ERoundState.SPLIT_TURN:
                stateInfo.cards.split?.length === 2 && this.gameScene?.setActiveHand('split');
                if (stateInfo.cards.split!.length >= 2) {
                    this.gamePanel?.updateButtons(stateInfo.currentState, stateInfo.cards.split!, stateInfo.isDoubleAllowed);
                }
                this.footer?.setPlayerTurnText(stateInfo.isDoubleAllowed, stateInfo.isSplitAllowed);
                break;

            case ERoundState.DEALERS_TURN:
                this.footer?.updateText("Playing dealer's cards")
                this.gameScene && this.gameScene.setActiveHand('dealer');
                break;

            case ERoundState.ROUND_OVER:
                this.footer?.setFinalText(stateInfo.roundResult, stateInfo.win)
                this.gameScene && this.gameScene.setActiveHand('dealer');
                this.finalPanel = new FinalPanel();
                this.setCurrentFooterPanel(this.finalPanel);

                if (stateInfo.win > 0) {
                    const popup = this.gameScene?.renderWinPopup(stateInfo.win);
                    const sound = Main.assetsController.getSound(SOUNDS.popup);
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

    private renderHeader(stateInfo: IRoundStateDTO, playerBalance: number, totalWin: number) {
        this.header = new Header(stateInfo.win, playerBalance, totalWin);
        this.header.position.set(0, 0);
        this.app.stage.addChild(this.header);
    }

    private renderFooter() {
        this.footer = new Footer(this.soundsOn);
        this.footer.zIndex = 10;
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
        this.header?.onBetUpdate(sum);
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

    private onModalChange(isOn: boolean) {
        if (!isOn) {
            this.app.stage.removeChild(this.infoModal!);
            return;
        }
        if (!this.infoModal) {
            this.infoModal = new Modal();
        }
        this.app.stage.addChild(this.infoModal);
    }

    private onTurnEnd(result: IRoundResult) {
        this.gameScene?.onTurnEnd(result);
    }

    public onResize() {
        this.background?.onResize();
        this.header?.onResize();
        this.footer?.onResize();
        this.currentScene?.onResize()
        if (this.currentFooterPanel) {
            this.currentFooterPanel.position.set(0, Main.screenSize.height);
            this.currentFooterPanel.onResize()
        }

    }
    public deactivate() {
        this.header?.deactivate();
        this.footer?.deactivate();
        this.currentFooterPanel && this.currentFooterPanel.deactivate();
        this.gameScene && this.gameScene.deactivate();
        Main.signalsController.round.endTurn.remove(this.onTurnEnd);
        Main.signalsController.round.stateChanged.remove(this.onStateChanged);
        Main.signalsController.bet.updated.remove(this.onBetUpdate);
        Main.signalsController.card.deal.remove(this.onCardDeal);
        Main.signalsController.card.open.remove(this.onCardOpen);
        Main.signalsController.info.isOn.remove(this.onModalChange);
    }
}