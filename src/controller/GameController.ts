import { Application } from "pixi.js";
import { RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { RoundController } from "./RoundController";
import { Main } from "../main";
import { BettingController } from "./BettingController";
import { IStateInfo } from "../data/types";

export class GameController {
    private app: Application;
    private round: RoundController;
    private _playerBalance = 1000;
    private _totalWin = 0;
    private previousBet = 0;
    private gameView: GameView | null = null;
    private roundModel: RoundModel | null = null;
    private bettingController: BettingController | null = null;
    private history: IStateInfo[] = [];

    constructor(app: Application) {
        this.app = app;
        this.gameView = new GameView(this.app, this.playerBalance, this.totalWin);
        this.roundModel = new RoundModel(this.previousBet);
        this.bettingController = new BettingController(this.roundModel, this);
        this.round = new RoundController(this.roundModel, this.gameView);
    }

    public init() {
        this.gameView && this.gameView.renderInitialScene();
        this.setEventListeners();
    }

    private setEventListeners() {
        Main.signalController.round.new.add(this.onNewRound, this);
        Main.signalController.round.end.add(this.onRoundEnd, this);
        Main.signalController.bet.updated.add(this.onBetUpdate, this);
    }

    private onNewRound() {
        console.log('new round');
        this.app.stage.removeChildren();
        this.removeFromBalance(this.previousBet);
        this.gameView = new GameView(this.app, this.playerBalance, this._totalWin);
        this.roundModel = new RoundModel(this.previousBet);
        this.round = new RoundController(this.roundModel, this.gameView);
        this.bettingController = new BettingController(this.roundModel, this);
        Main.signalController.round.start.emit();
    }

    private onRoundEnd() {
        this.history.push(this.round.roundModel.roundStateInfo);
        this._totalWin += this.round.roundModel.roundStateInfo.win;
    }

    private onBetUpdate(betSize: number) {
        this.previousBet = betSize;
    }

    get playerBalance() {
        return this._playerBalance;
    }

    get totalWin() {
        console.log('total win: '+ this._totalWin)
        return this._totalWin;
    }

    public addToBalance(value: number) {
        this._playerBalance += value;
    }

    public addToTotalWin(value: number) {
        this._totalWin += value;
    }

    public removeFromBalance(value: number) {
        this._playerBalance -= value;
    }
}