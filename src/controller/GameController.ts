import { Application } from "pixi.js";
import { RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { RoundController } from "./RoundController";
import { Main } from "../main";
import { BettingController } from "./BettingController";
import { ERoundState } from "../data/types";

export class GameController {
    private app: Application;
    private roundController: RoundController;
    private _playerBalance = 1000;
    private _totalWin = 0;
    private _previousBet = 0;
    private gameView: GameView | null = null;
    private roundModel: RoundModel | null = null;
    private bettingController: BettingController | null = null;
    // private history: IStateInfo[] = [];
    private soundsOn= true;

    constructor(app: Application) {
        this.app = app;
        this.roundModel = new RoundModel(ERoundState.NOT_STARTED);
        this.gameView = new GameView(this.app, this.playerBalance, this.totalWin, this.roundModel.state, this.soundsOn);
        this.bettingController = new BettingController(this.roundModel, this);
        this.roundController = new RoundController(this.roundModel, this.gameView, this.bettingController);
        this.init();
    }

    private init(){
        this.gameView && this.gameView.renderInitialScene();
        this.setEventListeners();
    }

    private setEventListeners() {
        Main.signalsController.round.new.add(this.onNewRound, this);
        Main.signalsController.round.end.add(this.onRoundEnd, this);
        Main.signalsController.sounds.isOn.add(this.onSoundsChange, this);
    }

    private onNewRound() {
        console.log('%cNew round', 'color: red');
        this.roundController.deactivate()
        this.app.stage.removeChildren();
        this.roundModel = new RoundModel(ERoundState.BETTING);
        this.gameView = new GameView(this.app, this.playerBalance, this._totalWin, this.roundModel.state, this.soundsOn);
        this.bettingController = new BettingController(this.roundModel, this);
        this.roundController = new RoundController(this.roundModel, this.gameView, this.bettingController);
        Main.signalsController.round.start.emit();
    }

    private onRoundEnd() {
        // this.history.push(this.roundController.roundModel.roundStateInfo);
        // this._totalWin += this.roundController.roundModel.winSize;
        // this._playerBalance += this.roundController.roundModel.winSize;
    }

    get playerBalance() {
        return this._playerBalance;
    }

    get totalWin() {
        return this._totalWin;
    }

    get previousBet() {
        return this._previousBet;
    }

    set previousBet(value: number) {
        this._previousBet = value;
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

    public onResize() {
        this.gameView?.onResize();
    }

    private onSoundsChange(isOn: boolean) {
        this.soundsOn = isOn;
        Howler.mute(!isOn);
    }
}