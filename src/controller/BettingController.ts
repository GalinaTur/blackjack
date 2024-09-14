import { ALL_BETS } from "../data/constants";
import { TBets, TRoundResult } from "../data/types";
import { Main } from "../main";
import { RoundModel } from "../model/RoundModel";
import { GameController } from "./GameController";

export class BettingController {
    private roundModel: RoundModel;
    private gameController: GameController;
    private betValues: TBets[] = [];
    private betsHistory: Array<TBets | number> = [];

    constructor(roundModel: RoundModel, gameController: GameController) {
        this.init();
        this.roundModel = roundModel;
        this.gameController = gameController;
    }

    private init() {
        Main.signalController.bet.added.add(this.onBetAdd, this);
        Main.signalController.bet.cleared.add(this.onClearBet, this);
        Main.signalController.bet.doubled.add(this.onDoubledBet, this);
        Main.signalController.bet.removedLast.add(this.onRemoveLast, this);
        Main.signalController.player.double.add(this.onPlayerDoubleDown, this);
        Main.signalController.round.end.add(this.onRoundEnd, this);
    }

    private onBetAdd(value: TBets) {
        if (value > this.gameController.playerBalance) return;
        this.roundModel.increaseBet(value);
        this.gameController.removeFromBalance(value);

        this.betsHistory.push(value);
        this.emitChanges();
    }

    private onClearBet() {
        const bet = this.roundModel.betSize;
        this.roundModel.clearBet();
        this.gameController.addToBalance(bet);

        this.betsHistory = [];
        this.emitChanges();
    }

    private onRemoveLast() {
        const lastValue = this.betsHistory.pop();
        if (!lastValue) return;
        this.roundModel.decreaseBet(lastValue);
        this.gameController.addToBalance(lastValue);
        this.emitChanges();
    }

    private onDoubledBet() {
        const valueToAdd = this.roundModel.betSize;
        this.roundModel.increaseBet(valueToAdd);
        this.gameController.removeFromBalance(valueToAdd);
        this.betsHistory.push(valueToAdd);
        this.emitChanges();
    }

    private onPlayerDoubleDown() {
        this.onDoubledBet();
    }

    private onRoundEnd(result: TRoundResult) {
        const win = this.setWinToBalance(result);
        this.gameController.previousBet = this.roundModel.betSize;
        if (win) {
            this.roundModel.winSize = win;
            this.gameController.addToTotalWin(win);
        }

        this.emitChanges();
        Main.signalController.winSize.updated.emit({ win: win, totalWin: this.gameController.totalWin });
    }

    private emitChanges() {
        const availableBets = this.setAvailableBets();
        const isDoubleAllowed = this.roundModel.betSize <= this.gameController.playerBalance;
        Main.signalController.bet.updated.emit({ betValues: this.betValues, sum: this.roundModel.betSize, availableBets: availableBets, isDoubleBetAllowed: isDoubleAllowed });
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

        this.emitChanges();
    }

    private checkIfCanSplice(choosedBets: TBets[]) {

    }

    private setWinToBalance(result: TRoundResult) {
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
        Main.signalController.bet.doubled.remove(this.onDoubledBet);
        Main.signalController.bet.removedLast.remove(this.onRemoveLast);
        Main.signalController.bet.cleared.remove(this.onClearBet);
        Main.signalController.player.double.remove(this.onPlayerDoubleDown);
        Main.signalController.round.end.remove(this.onRoundEnd);
    }
}