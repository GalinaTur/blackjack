import { ALL_BETS } from "../data/constants";
import { IRoundResult, TBets, TResult } from "../data/types";
import { Main } from "../main";
import { RoundModel } from "../model/RoundModel";
import { GameController } from "./GameController";

export class BettingController {
    private roundModel: RoundModel;
    private gameController: GameController;
    // private betsStack: TBets[] = [];
    private betsHistory: Array<TBets | number> = [];
    private splittedBet: number = 0;

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
        // Main.signalController.player.double.add(this.onDoubledBet, this);
        Main.signalController.round.end.add(this.onRoundEnd, this);
    }

    private onBetAdd(value: TBets) {
        if (value > this.gameController.playerBalance) return;
        this.roundModel.increaseBet(value);
        this.gameController.removeFromBalance(value);
        this.gameController.previousBet = this.roundModel.betSize;

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

    private doubleBet(bet?: number) {
        const valueToAdd = bet || this.roundModel.betSize;
        if (this.gameController.playerBalance < valueToAdd) return;
        this.roundModel.increaseBet(valueToAdd);
        this.gameController.removeFromBalance(valueToAdd);
        this.betsHistory.push(valueToAdd);
    }

    private onDoubledBet(): void {
        this.doubleBet();
        this.emitChanges();
    }

    // private onPlayerDoubleDown() {
    //     this.doubleBet();
    // }

    public onPlayerSplit() {
        // const isSplit = true;
        this.splittedBet = this.roundModel.betSize;
        this.doubleBet();
        const betsStack = this.setBetsStack(this.splittedBet);
        Main.signalController.bet.updated.emit({ betsStack: betsStack, sum: this.roundModel.betSize });
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    private onRoundEnd(result: IRoundResult) {
        const win = this.setWinToBalance(result);
        if (win) {
            this.roundModel.winSize = win;
            this.gameController.addToTotalWin(win);
        }

        this.emitChanges();
        Main.signalController.winSize.updated.emit({ win: win, totalWin: this.gameController.totalWin });
    }

    private emitChanges() {
        const betsStack = this.setBetsStack();
        const availableBets = this.setAvailableBets();
        const isDoubleAllowed = this.roundModel.betSize <= this.gameController.playerBalance;
        Main.signalController.bet.updated.emit({ betsStack: betsStack, sum: this.roundModel.betSize, availableBets: availableBets, isDoubleBetAllowed: isDoubleAllowed });
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

    private setBetsStack(bet?: number) {
        let betSize = bet || this.roundModel.betSize;
        const betsMap: Map<TBets, number> = new Map<TBets, number>();
        const betsStack: TBets[] = []
        for (let i = ALL_BETS.length - 1; i >= 0; i--) {
            const bet = ALL_BETS[i];
            if (bet <= betSize) {
                const amount = Math.floor(betSize / bet);
                betSize = betSize % bet;
                betsMap.set(bet, amount);
            }
        }

        for (let [bet, amount] of betsMap.entries()) {
            betsStack.push(...Array(amount).fill(bet));
        }
        return betsStack;
    }

    private setWinToBalance(result: IRoundResult) {
        const bet = this.roundModel.betSize;
        let win = 0;
        switch (result) {
            // case 'playerBJ':
            //     win = bet * 1.5;
            //     this.gameController.addToBalance(win + bet);
            //     break;
            // case 'win':
            // case 'dealerBust':
            //     win = bet;
            //     this.gameController.addToBalance(win + bet);
            //     break;
            // case 'push':
            //     this.gameController.addToBalance(bet);
            //     break;
        }
        console.log(`%cResult: ${result}, Bet: ${bet}, Win: ${win}`, 'color: yellow');
        return win;
    }

    private calculateWinSize(result: TResult) {
        
    }

    public deactivate() {
        Main.signalController.bet.added.remove(this.onBetAdd);
        Main.signalController.bet.doubled.remove(this.onDoubledBet);
        Main.signalController.bet.removedLast.remove(this.onRemoveLast);
        Main.signalController.bet.cleared.remove(this.onClearBet);
        Main.signalController.round.end.remove(this.onRoundEnd);
    }
}