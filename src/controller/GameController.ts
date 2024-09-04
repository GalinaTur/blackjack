import { Application } from "pixi.js";
import { IStateInfo, RoundModel } from "../model/RoundModel";
import { GameView } from "../view/GameView";
import { RoundController } from "./RoundController";
import { Main } from "../main";

export class GameController {
    private app: Application;
    private round: RoundController;
    private playerBalance = 1000;
    private totalWin = 0;
    private previousBet = 0;
    private gameView: GameView | null = null;
    private history: IStateInfo[] = [];

    constructor(app: Application) {
        this.app = app;
        this.gameView = new GameView(this.app, this.playerBalance, this.totalWin);
        this.round = new RoundController(new RoundModel(this.previousBet), this.gameView);
    }

    public init() {
        this.gameView && this.gameView.renderInitialScene();
        this.setEventListeners();
    }

    private setEventListeners() {
        Main.signalController.round.new.add(this.onNewRound, this);
        Main.signalController.round.end.add(this.onRoundEnd, this);
    }

    private onNewRound() {
        console.log('new round');
        this.app.stage.removeChildren();
        this.round = new RoundController(new RoundModel(this.previousBet), new GameView(this.app, this.playerBalance, this.totalWin));
        Main.signalController.round.start.emit();
    }

    private onRoundEnd() {
        this.history.push(this.round.roundModel.roundStateInfo);
        this.totalWin += this.round.roundModel.roundStateInfo.win;
        this.previousBet = this.round.roundModel.betSize;
    }
}