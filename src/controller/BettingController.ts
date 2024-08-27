import { Main } from "../main";

export class BettingController {
    bets = [1, 5, 10, 25, 100, 500, 1000, 5000];
    betSize = 0;
    isBetConfirmed = false;

    constructor(playerBalance: number) {
        this.init();
        // this.playerBalance = playerBalance;
    }

    init() {
        Main.signalController.bet.added.add(this.onBetAdd, this);
        Main.signalController.bet.cleared.add(this.onClearBet, this);
        Main.signalController.bet.placed.add(this.onConfirmBet, this);
    }

    onBetAdd(value: number) {
        this.betSize = this.betSize + value;
        Main.signalController.bet.updated.emit(this.betSize);
    }

    onClearBet() {
        this.betSize = 0;
        Main.signalController.bet.updated.emit(this.betSize);
    }

    onConfirmBet() {
        this.isBetConfirmed = true;
    }
}