import { CardModel } from "./CardModel";

export class RoundModel {

    private _roundStateInfo: IStateInfo = {
        isStarted: false,
        isBetPlaced: false,
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
        roundResult: null,
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

    public changeState() {

    }

    get roundStateInfo() {
        return this._roundStateInfo;
    }

    set isStarted(isStarted: boolean) {
        this._roundStateInfo.isStarted = isStarted;
        this._roundStateInfo.currentState = ERoundState.BETTING;
    }

    set isBetPlaced(isBetPlaced: boolean) {
        this._roundStateInfo.isBetPlaced = isBetPlaced;
        this._roundStateInfo.currentState = ERoundState.CARDS_DEALING;
    }

    // set bet(bet: number) {
    //     this._roundStateInfo.bet = bet;

    // }

    // get bet() {
    //     return this._roundStateInfo.bet;
    // }

    get cards() {
        return this._roundStateInfo.cards;
    }

    get points() {
        return this._roundStateInfo.points;
    }

    public setPoints(person: keyof IPoints, points: number) {
        this._roundStateInfo.points[person] = points;
    }

    public endRound(roundResult: TRoundResult) {
        this._roundStateInfo.roundResult = roundResult;
        this._roundStateInfo.currentState = ERoundState.ROUND_OVER;
    }

    public startDealersTurn() {
        this._roundStateInfo.currentState = ERoundState.DEALERS_TURN;
    }

    public isBust(points: number) {
        return points > 21;
    }


    public checkIfTie() {
        return (this.points.dealer === this.points.player);
    }


    public comparePoints() {
        this.checkIfTie() ? this.endRound('push') :
            this.points.player > this.points.dealer ?
                this.endRound('win') : this.endRound('loss');
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
    isBetPlaced: boolean,
    currentState: ERoundState,
    cards: ICardsDealed,
    points: IPoints,
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

export type TRoundResult = "playerBJ" | "dealerBJ" | "win" | "doubleWin" | "loss"
    | "push" | "playerBust" | "dealerBust"
    | "surrender" | "insurance"