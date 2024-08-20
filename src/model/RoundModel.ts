import { CardModel } from "./CardModel";
import { DeckModel } from "./DeckModel";

export enum ERoundState {
    NOT_STARTED,
    BETTING,
    CARDS_DEALING,
    PLAYERS_TURN,
    DEALERS_TURN,
    ROUND_OVER
}

export class RoundModel {
    public currentState: ERoundState;

    constructor() {
        this.currentState = ERoundState.NOT_STARTED;
    }

    startNewRound() {
        this.currentState = ERoundState.BETTING;
    }

    playerBet(bet:number) {
        // this.player.placeBet(bet);
        this.currentState = ERoundState.CARDS_DEALING;
    }
    
    confirmDealingEnded(cardsOnHand: CardModel[]) {
        if (cardsOnHand.length === 2) {
            this.currentState = ERoundState.PLAYERS_TURN;
        }
    }
}