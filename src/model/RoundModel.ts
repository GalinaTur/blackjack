import { ERoundState, IRoundResult, TBets, TParticipants, TResult } from "../data/types";
import { DealerModel } from "./DealerModel";
import { DeckModel } from "./DeckModel";
import { PlayerModel } from "./PlayerModel";

export class RoundModel {
    private _deck = new DeckModel();
    private _mainHand = new PlayerModel('player', this._deck);
    private _dealerHand = new DealerModel('dealer', this._deck);
    private _splitHand: PlayerModel | null = null;
    private _currentState = ERoundState.BETTING;
    private _bet = 0;
    private _win = 0;
    private roundResult: IRoundResult = {
        main: null,
        split: null
    }

    constructor(initialState: ERoundState) {
        this._currentState = initialState
    }

    public increaseBet(value: number) {
        this._bet += value
    }

    public decreaseBet(value: number) {
        this._bet -= value
    }

    public clearBet() {
        this._bet = 0;
    }

    public isDealingEnded() {
        if (this._dealerHand.cards.length < 2 ||
            this._mainHand.cards.length < 2) {
            return false;
        }
        return true;
    }

    public split() {
        this._splitHand = new PlayerModel('split', this._deck);
        const card = this._mainHand.splitCards();
        if (!card) {
            console.log('No card for split');
            return;
        }
        this._splitHand.pushCard(card);
    }

    private setNextState() {
        if (this.state === ERoundState.PLAYERS_TURN && !this.splitHand) {
            return ERoundState.DEALERS_TURN;
        };

        if (this.state === ERoundState.ROUND_OVER) {
            return null;
        };
        return ERoundState[ERoundState[this.state + 1] as keyof typeof ERoundState];
    }

    get mainHand() {
        return this._mainHand;
    }

    get splitHand() {
        return this._splitHand;
    }

    get dealerHand() {
        return this._dealerHand;
    }

    get betSize() {
        return this._bet;
    }

    public goToNextState() {
        this._currentState = this.setNextState() || this._currentState;
    }

    public endRound() {
        this._currentState = ERoundState.ROUND_OVER;
        console.log(`%cEnabled state: ${ERoundState[this.state]}`, "color: green");
    }

    get state() {
        return this._currentState;
    }

    set winSize(value: number) {
        this._win = value;
    }

    get winSize() {
        return this._win;
    }

    public setResult(roundResult: TResult, hand?: TParticipants) {
        if (hand === 'split') {
            this.roundResult.split = roundResult;
            return;
        }
        this.roundResult.main = roundResult;
    }

    public getResult() {
        return this.roundResult;
    }
}

