import { CardModel } from "./CardModel";

export class RoundModel {

    private _roundStateInfo: IStateInfo = {
        bet: 0,
        win: 0,
        currentState: ERoundState.NOT_STARTED,
        cards: {
            dealer: [],
            player: [],
            split: [],
        },
        isSplitAllowed: false,
        roundResult: null,
    }

    constructor(previousBet: number) {
        this._roundStateInfo.bet = previousBet;
    }

    public increaseBet(value: number) {
        this._roundStateInfo.bet += value
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
        this._roundStateInfo.currentState = ERoundState.PLAYERS_TURN;
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

    set result(roundResult: TRoundResult) {
        this._roundStateInfo.roundResult = roundResult;
    }
}

export enum ERoundState {
    NOT_STARTED,
    BETTING,
    CARDS_DEALING,
    PLAYERS_TURN,
    DEALERS_TURN,
    ROUND_OVER
}

export interface IStateInfo {
    // isStarted: boolean,
    // isBetPlaced: boolean,
    bet: number,
    win: number,
    currentState: ERoundState,
    cards: ICardsDealed,
    isSplitAllowed: boolean,
    roundResult: TRoundResult | null,
}

export interface ICardsDealed {
    dealer: CardModel[],
    player: CardModel[],
    split: CardModel[]
}

export interface IPoints {
    dealer: number,
    player: number,
}

export type TRoundResult = "playerBJ" | "dealerBJ" | "win" | "doubleWin" | "lose"
    | "push" | "pushBJ" | "playerBust" | "dealerBust"
    | "surrender" | "insurance" 