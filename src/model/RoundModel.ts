import { CardModel } from "./CardModel";

export class RoundModel {

    private _roundStateInfo: IStateInfo = {
        isStarted: false,
        bet: 0,
        currentState: ERoundState.NOT_STARTED,
        cards: {
            dealer: [],
            player: [],
            split: [],
            },
        points: {
            dealer: 0,
            player: 0,
        },
        isSplitAllowed: false,
    }

    public dealTo(person: keyof ICardsDealed, card: CardModel) {
        if (person === 'player') {
            card.hidden = false;
            this._roundStateInfo.cards.player.push(card);
            return;
        }

        if (this._roundStateInfo.cards.dealer.length === 0) {
            card.hidden = false;
        }
        this._roundStateInfo.cards.dealer.push(card);
    }

    public isDealingEnded() {
        if (this._roundStateInfo.cards.dealer.length === 2 &&
            this._roundStateInfo.cards.player.length === 2) {
            this._roundStateInfo.currentState = ERoundState.PLAYERS_TURN;
        }
    }

    get roundStateInfo() {
        return this._roundStateInfo;
    }

    set isStarted(isStarted: boolean) {
        this._roundStateInfo.isStarted = isStarted;
        this._roundStateInfo.currentState = ERoundState.BETTING;
    }

    set bet(bet: number) {
        this._roundStateInfo.bet = bet;
        this._roundStateInfo.currentState = ERoundState.CARDS_DEALING;
    }

    get bet() {
        return this._roundStateInfo.bet;
    }

    get cards() {
        return this._roundStateInfo.cards;
    }

    get points() {
        return this._roundStateInfo.points;
    }

    setPoints(person: keyof IPoints, points: number) {
        this._roundStateInfo.points[person] = points;
    }

    set dealerPoints(points: number) {
        this._roundStateInfo.points.dealer = points;
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

interface IStateInfo {
    isStarted: boolean,
    bet: number,
    currentState: ERoundState,
    cards: ICardsDealed,
    points: IPoints,
    isSplitAllowed: boolean,
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