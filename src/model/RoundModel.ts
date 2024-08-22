import { CardModel } from "./CardModel";

export enum ERoundState {
    NOT_STARTED,
    BETTING,
    CARDS_DEALING,
    PLAYERS_TURN,
    DEALERS_TURN,
    ROUND_OVER
}

export class RoundModel {
    public currentState: ERoundState; //make private and getter

    constructor() {
        this.currentState = ERoundState.NOT_STARTED;
    }

    checkRoundStarted(isStarted: boolean) {
        if (!isStarted) {
            this.currentState = ERoundState.NOT_STARTED;
        } else {
            this.currentState = ERoundState.BETTING;
        }
    }

    playerBet(bet: number) {
        // this.player.placeBet(bet);
        this.currentState = ERoundState.CARDS_DEALING;
    }

    confirmDealingEnded(cardsOnHand: CardModel[]) {
        if (cardsOnHand.length === 2) {
            this.currentState = ERoundState.PLAYERS_TURN;
        }
    }
}