import { ERoundState, ICardsDealed, IRoundResult, IStateInfo, TBets, TParticipants, TResult } from "../data/types";
import { CardModel } from "./CardModel";

export class RoundModel {

    private _roundStateInfo: IStateInfo = {
        availableBets: [],
        bet: 0,
        win: 0,
        currentState: ERoundState.BETTING,
        cards: {
            dealer: [],
            player: [],
            split: [],
        },
        isSplitAllowed: false,
        roundResult: {
            main: null,
            split: null
        },
    }

    // constructor(initialState: ERoundState) {
    //     this._roundStateInfo.currentState = initialState;
    // }

    public increaseBet(value: number) {
        this._roundStateInfo.bet += value
    }

    public decreaseBet(value: number) {
        this._roundStateInfo.bet -= value
    }

    public clearBet() {
        this._roundStateInfo.bet = 0;
    }

    public dealTo(person: keyof ICardsDealed, card: CardModel) {
        if (person === 'dealer' && this.cards.dealer.length === 1) {
            this._roundStateInfo.cards[person].push(card);
            return;
        }

        card.hidden = false;
        this._roundStateInfo.cards[person].push(card);
    }

    public isDealingEnded() {
        if (this._roundStateInfo.cards.dealer.length < 2 ||
            this._roundStateInfo.cards.player.length < 2) {
            return false;
        }
        return true;
    }

    get roundStateInfo() {
        return this._roundStateInfo;
    }

    get betSize() {
        return this._roundStateInfo.bet;
    }

    get cards() {
        return this._roundStateInfo.cards;
    }

    set state(state: ERoundState) {
        this._roundStateInfo.currentState = state;
    }

    get state() {
        return this._roundStateInfo.currentState;
    }

    set winSize(value: number) {
        this._roundStateInfo.win = value;
    }

    get winSize() {
        return this._roundStateInfo.win;
    }

    set result(roundResult: TResult) {
        if (this.state === ERoundState.SPLIT_TURN) {
            this._roundStateInfo.roundResult.split = roundResult;
        } else {
            this._roundStateInfo.roundResult.main = roundResult;
        }
    }

    public setResult(roundResult: TResult, hand: TParticipants) {
        if (hand === 'split') {
            this._roundStateInfo.roundResult.split = roundResult;
            return;
        }
        this._roundStateInfo.roundResult.main = roundResult;
    }

    public getResult() {
        return this._roundStateInfo.roundResult;
    }

    set availableBets(bets: TBets[]) {
        this._roundStateInfo.availableBets = bets;
    }
}

