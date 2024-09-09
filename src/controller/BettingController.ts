import { ALL_BETS } from "../data/constants";
import { TBets, TRoundResult } from "../data/types";
import { Main } from "../main";
import { RoundModel } from "../model/RoundModel";
import { GameController } from "./GameController";

export class BettingController {
    private roundModel: RoundModel;
    private gameController: GameController;
    private betValues: TBets[] = [];

    constructor(roundModel: RoundModel, gameController: GameController) {
        this.init();
        this.roundModel = roundModel;
        this.gameController = gameController;
    }

    private init() {
        Main.signalController.bet.added.add(this.onBetAdd, this);
        Main.signalController.bet.cleared.add(this.onClearBet, this);
        Main.signalController.round.end.add(this.onRoundEnd, this);
    }

    private onBetAdd(value: TBets) {
        if (value > this.gameController.playerBalance) return;
        this.roundModel.increaseBet(value);
        this.gameController.removeFromBalance(value);
        const availableBets = this.setAvailableBets();

        Main.signalController.bet.updated.emit({ betValues: this.betValues, sum: this.roundModel.betSize, availableBets: availableBets });
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    private onClearBet() {
        const bet = this.roundModel.betSize;
        this.roundModel.clearBet();
        this.gameController.addToBalance(bet);
        this.setAvailableBets();
        const availableBets = this.setAvailableBets();

        Main.signalController.bet.updated.emit({ betValues: this.betValues, sum: this.roundModel.betSize, availableBets: availableBets });
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    private onRoundEnd(result: TRoundResult) {
        const win = this.setWin(result);
        this.gameController.previousBet = this.roundModel.betSize;
        this.roundModel.clearBet();
        if (win) {
            this.roundModel.winSize = win;
            this.gameController.addToTotalWin(win);
        }

        const availableBets = this.setAvailableBets();

        Main.signalController.bet.updated.emit({ betValues: this.betValues, sum: this.roundModel.betSize, availableBets: availableBets });
        Main.signalController.winSize.updated.emit({ win: win, totalWin: this.gameController.totalWin });
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    public setAvailableBets() {
        const bets = ALL_BETS.filter(bet => bet <= this.gameController.playerBalance);
        return bets;
    }

    public setInitialBet() {
        let bet = this.gameController.previousBet;
        if (this.gameController.previousBet >= this.gameController.playerBalance) {
            bet = 0;
        };
        this.roundModel.increaseBet(bet);
        this.gameController.removeFromBalance(bet);
        const availableBets = this.setAvailableBets();

        Main.signalController.bet.updated.emit({ betValues: this.betValues, sum: this.roundModel.betSize, availableBets: availableBets });
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    private checkIfCanSplice(choosedBets: TBets[]) {

    }

    private setWin(result: TRoundResult) {
        const bet = this.roundModel.betSize;
        let win = 0;
        switch (result) {
            case 'playerBJ':
                win = bet * 1.5;
                this.gameController.addToBalance(win + bet);
                break;
                case 'win':
            case 'dealerBust':
                win = bet;
                this.gameController.addToBalance(win + bet);
                break;
                case 'push':
                    this.gameController.addToBalance(bet);
                    break;
                }
                console.log(`%cResult: ${result}, Bet: ${bet}, Win: ${win}`, 'color: yellow');
        return win;
    }

    public deactivate() {
        Main.signalController.bet.added.remove(this.onBetAdd);
        Main.signalController.bet.cleared.remove(this.onClearBet);
        Main.signalController.round.end.remove(this.onRoundEnd);
    }
}