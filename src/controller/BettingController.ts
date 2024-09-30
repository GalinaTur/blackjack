import { ALL_BETS } from "../data/constants";
import { ERoundState, IRoundResult, TBets, TParticipants, TResult } from "../data/types";
import { Main } from "../main";
import { RoundModel } from "../model/RoundModel";
import { GameController } from "./GameController";

export class BettingController {
    private roundModel: RoundModel;
    private gameController: GameController;
    private betsHistory: Array<TBets | number> = [];
    private splittedBet: {
        [key in TParticipants]?: number
    } | null = null;
    private activeHand: TParticipants = 'player'

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

    private doubleBet(bet?: number): void {
        const valueToAdd = bet || this.roundModel.betSize;
        if (this.gameController.playerBalance < valueToAdd) return;
        this.roundModel.increaseBet(valueToAdd);
        this.gameController.removeFromBalance(valueToAdd);
        this.betsHistory.push(valueToAdd);
    }

    private onDoubledBet(hand: TParticipants): void {
        const valueToDouble = this.splittedBet?.[hand] || this.roundModel.betSize;
        this.doubleBet(valueToDouble);
        if (this.splittedBet?.[hand]) this.splittedBet[hand] += valueToDouble;
        this.emitChanges();
    }

    public onPlayerSplit() {
        this.splittedBet = {
            player: this.roundModel.betSize,
            split: this.roundModel.betSize
        }
        this.doubleBet(this.roundModel.betSize);
        const isDoubleAllowed = this.roundModel.betSize <= this.gameController.playerBalance;
        const betsStack = this.setBetsStack(this.roundModel.betSize/2);
        Main.signalController.bet.updated.emit({ betsStack: betsStack, sum: this.roundModel.betSize, isDoubleBetAllowed: isDoubleAllowed });
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    private onRoundEnd(result: IRoundResult) {
        const win = this.setWin(result);
        if (win) {
            this.roundModel.winSize = win;
            this.gameController.addToTotalWin(win);
        }

        Main.signalController.winSize.updated.emit({ win: win!, totalWin: this.gameController.totalWin });
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);
    }

    private emitChanges() {
        let bet = this.splittedBet?.[this.activeHand] || this.roundModel.betSize;
        const betsStack = this.setBetsStack(bet);
        const isDoubleAllowed = this.roundModel.betSize <= this.gameController.playerBalance;
        Main.signalController.balance.updated.emit(this.gameController.playerBalance);

        if (this.roundModel.state === ERoundState.BETTING) {
            const availableBets = this.setAvailableBets();
            Main.signalController.bet.updated.emit({ betsStack: betsStack, sum: this.roundModel.betSize, availableBets: availableBets, isDoubleBetAllowed: isDoubleAllowed });
            return;
        }
        Main.signalController.bet.updated.emit({ betsStack: betsStack, sum: this.roundModel.betSize, isDoubleBetAllowed: isDoubleAllowed });
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

    private setBetsStack(bet:number) {
        let betSize = bet;
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

    private setWin(result: IRoundResult) {
        if (!result.main) return;
        const bet = this.splittedBet?.player || this.roundModel.betSize;
        let win = this.addWinToBalance(result.main, bet!);
        if (result.split) win += this.addWinToBalance(result.split, this.splittedBet?.split!);
      
        console.log(`%cResult: ${result.main}, Split: ${result.split || 'No'}, Bet: ${this.roundModel.betSize}, Win: ${win}, Balance: ${this.gameController.playerBalance}`, 'color: yellow');
        return win;
    }

    private addWinToBalance(result: TResult, bet: number) {
        let win = 0;
        switch (result) {
            case "playerBJ":
                win = bet * 1.5;
                this.gameController.addToBalance(win + bet);
                break;
            case 'win':
            case 'dealerBust':
            case 'doubleWin':
                win = bet;
                this.gameController.addToBalance(win + bet);
                break;
            case 'push':
                this.gameController.addToBalance(bet);
                break;
        }
        return win
    }

    public deactivate() {
        Main.signalController.bet.added.remove(this.onBetAdd);
        Main.signalController.bet.doubled.remove(this.onDoubledBet);
        Main.signalController.bet.removedLast.remove(this.onRemoveLast);
        Main.signalController.bet.cleared.remove(this.onClearBet);
        Main.signalController.round.end.remove(this.onRoundEnd);
    }
}