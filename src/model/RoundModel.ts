import { DeckModel } from "./DeckModel";

enum ERoundState {
    Betting,
    PlayersTurn,
    DealersTurn,
    RoundOver
}


export class RoundModel {
    private currentState: ERoundState;

    constructor() {
        this.currentState = ERoundState.Betting;
        this.resetRound();
    }

    resetRound() {
        const deck = new DeckModel();
        deck.shuffle();
    }
}