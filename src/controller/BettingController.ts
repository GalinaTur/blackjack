import { Main } from "../main";
import { BetModel } from "../model/BetModel";

export class BettingController {
    betModel: BetModel;

    constructor(betModel: BetModel) {
        this.init();
        this.betModel = betModel;
        // this.playerBalance = playerBalance;
    }

    init() {
        Main.signalController.bet.added.add(this.onBetAdd, this);
        Main.signalController.bet.cleared.add(this.onClearBet, this);
        // Main.signalController.bet.placed.add(this.onConfirmBet, this);
    }

    onBetAdd(value: number) {
        this.betModel.increaseBet(value);
        Main.signalController.bet.updated.emit(this.betModel.betSize);
    }

    onClearBet() {
        this.betModel.clearBet();
        Main.signalController.bet.updated.emit(this.betModel.betSize);
    }
}