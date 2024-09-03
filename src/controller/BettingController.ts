import { Main } from "../main";
import { RoundModel } from "../model/RoundModel";

export class BettingController {
    private roundModel: RoundModel;

    constructor(roundModel: RoundModel) {
        this.init();
        this.roundModel = roundModel;
        // this.playerBalance = playerBalance;
    }

    private init() {
        Main.signalController.bet.added.add(this.onBetAdd, this);
        Main.signalController.bet.cleared.add(this.onClearBet, this);
    }

    private onBetAdd(value: number) {
        this.roundModel.increaseBet(value);
        Main.signalController.bet.updated.emit(this.roundModel.betSize);
    }

    private onClearBet() {
        this.roundModel.clearBet();
        Main.signalController.bet.updated.emit(this.roundModel.betSize);
    }
}