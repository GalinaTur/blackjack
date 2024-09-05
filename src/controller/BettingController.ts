import { TRoundResult } from "../data/types";
import { Main } from "../main";
import { RoundModel } from "../model/RoundModel";
import { GameController } from "./GameController";

export class BettingController {
    private roundModel: RoundModel;
    private gameController: GameController

    constructor(roundModel: RoundModel, gameController: GameController) {
        this.init();
        this.roundModel = roundModel;
        this.gameController = gameController;
    }

    private init() {
        Main.signalController.bet.added.add(this.onBetAdd, this);
        Main.signalController.bet.cleared.add(this.onClearBet, this);
        Main.signalController.round.end.add(this.setWin, this);
    }

    private onBetAdd(value: number) {
        this.roundModel.increaseBet(value);
        this.gameController.removeFromBalance(value);
        console.log(this.roundModel.betSize);
        Main.signalController.bet.updated.emit(this.roundModel.betSize);
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    private onClearBet() {
        const betSize = this.roundModel.betSize;
        this.roundModel.clearBet();
        this.gameController.addToBalance(betSize);
        Main.signalController.bet.updated.emit(this.roundModel.betSize);
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    private setWin(result: TRoundResult) {
        const bet = this.roundModel.betSize;
        let win = 0;
        switch (result) {
            case 'playerBJ':
                win = bet * 1.5;
                this.gameController.addToBalance(bet + win);
                break;
            case 'win':
            case 'dealerBust':
                win = bet;
                this.gameController.addToBalance(bet + win);
                break;
            case 'push':
                this.gameController.addToBalance(bet);
                break;
        }
        if (win === 0) return;
        this.gameController.addToTotalWin(win);
        console.log("winSize: " + win);
        this.roundModel.winSize = win;
        Main.signalController.winSize.updated.emit({win: win, totalWin: this.gameController.totalWin});

        this.deactivate();
    }

    private deactivate() {
        Main.signalController.bet.added.remove(this.onBetAdd);
        Main.signalController.bet.cleared.remove(this.onClearBet);
        Main.signalController.round.end.remove(this.setWin);
    }
}